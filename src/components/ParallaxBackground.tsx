/**
 * ParallaxBackground Component
 * Fond décoratif avec effet parallax au scroll
 * Phase 3: Scroll Animations
 */

import type { ReactNode, CSSProperties } from 'react';
import { useParallax } from '../hooks/useParallax';

interface ParallaxBackgroundProps {
  /**
   * Contenu principal au premier plan
   */
  children: ReactNode;

  /**
   * Vitesse du parallax (0.1 = très lent, 1 = vitesse normale)
   * @default 0.3
   */
  speed?: number;

  /**
   * Type de fond décoratif
   * @default 'gradient'
   */
  variant?: 'gradient' | 'dots' | 'grid' | 'none';

  /**
   * Classes CSS pour le container
   */
  className?: string;
}

export default function ParallaxBackground({
  children,
  speed = 0.3,
  variant = 'gradient',
  className = '',
}: ParallaxBackgroundProps) {
  const { transform } = useParallax({ speed });

  const backgroundStyles: Record<string, CSSProperties> = {
    gradient: {
      background: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
      filter: 'blur(60px)',
    },
    dots: {
      backgroundImage: 'radial-gradient(var(--pattern-color) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    grid: {
      backgroundImage: `
        linear-gradient(var(--pattern-color) 1px, transparent 1px),
        linear-gradient(90deg, var(--pattern-color) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
    },
    none: {},
  };

  return (
    <div className={`relative ${className}`}>
      {/* Parallax Background Layer */}
      {variant !== 'none' && (
        <div
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          style={{ transform }}
        >
          <div className="absolute inset-0 w-full h-[150%]" style={backgroundStyles[variant]} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
