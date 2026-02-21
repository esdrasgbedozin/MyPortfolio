/**
 * AnimatedCounter Component
 * Stats counter avec animation au scroll
 * Phase 4: Signature Elements
 */

import CountUp from 'react-countup';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { ReactElement } from 'react';

interface AnimatedCounterProps {
  /**
   * Valeur finale du compteur
   */
  end: number;

  /**
   * Valeur initiale
   * @default 0
   */
  start?: number;

  /**
   * Durée de l'animation (secondes)
   * @default 2.5
   */
  duration?: number;

  /**
   * Suffixe à afficher (ex: " projets")
   */
  suffix?: string;

  /**
   * Préfixe à afficher (ex: "$")
   */
  prefix?: string;

  /**
   * Séparateur des milliers
   * @default ","
   */
  separator?: string;

  /**
   * Nombre de décimales
   * @default 0
   */
  decimals?: number;

  /**
   * Label en dessous du compteur
   */
  label?: string;

  /**
   * Classes CSS additionnelles
   */
  className?: string;
}

export default function AnimatedCounter({
  end,
  start = 0,
  duration = 2.5,
  suffix = '',
  prefix = '',
  separator = ',',
  decimals = 0,
  label,
  className = '',
}: AnimatedCounterProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.5, once: true });

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 gradient-text mb-2">
        {isVisible && !prefersReducedMotion && (
          <CountUp
            start={start}
            end={end}
            duration={duration}
            separator={separator}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        )}
        {isVisible && prefersReducedMotion && (
          <span>
            {prefix}
            {end}
            {suffix}
          </span>
        )}
        {!isVisible && (
          <span>
            {prefix}
            {start}
            {suffix}
          </span>
        )}
      </div>
      {label && <p className="text-neutral-400 text-sm uppercase tracking-wider">{label}</p>}
    </div>
  );
}
