import type { ReactNode, HTMLAttributes, JSX } from 'react';
import Tilt from 'react-parallax-tilt';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * Contenu principal de la carte
   */
  children: ReactNode;

  /**
   * Contenu du header (optionnel)
   */
  header?: ReactNode;

  /**
   * Contenu du footer (optionnel)
   */
  footer?: ReactNode;

  /**
   * Variante visuelle de la carte
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'outlined';

  /**
   * Espacement interne de la carte
   * @default 'default'
   */
  padding?: 'none' | 'compact' | 'default' | 'comfortable';

  /**
   * Active l'effet hover
   * @default false
   */
  hoverable?: boolean;

  /**
   * Active l'effet Tilt 3D
   * @default false
   */
  tilt?: boolean;
}

/**
 * Composant Card : Carte atomique avec header/body/footer
 * Respect SOLID & Design Tokens (Dark Mode First)
 * Phase 2: Enhanced with glassmorphism + Tilt 3D option
 */
export const Card = ({
  children,
  header,
  footer,
  variant = 'default',
  padding = 'default',
  hoverable = false,
  tilt = false,
  className = '',
  ...props
}: CardProps): JSX.Element => {
  // Classes de base (semantic HTML + design tokens + glassmorphism)
  const baseClasses = 'rounded-xl border transition-all duration-300';

  // Variants : respectent les design tokens Dark Mode First + glassmorphism
  const variantClasses = {
    default: 'glass-effect border-white/10',
    elevated: 'card-elevated glass-effect border-white/10',
    outlined: 'bg-transparent border-2 border-neutral-700 hover:border-primary-500',
  };

  // Padding : respecte spacing scale (4-64px)
  const paddingClasses = {
    none: 'p-0',
    compact: 'p-4', // 16px
    default: 'p-6', // 24px
    comfortable: 'p-8', // 32px
  };

  // Hover effect (optionnel) avec glow
  const hoverClasses = hoverable
    ? 'hover:border-primary-400/50 cursor-pointer hover:shadow-lg hover:shadow-primary-500/20'
    : '';

  const allClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardContent = (
    <article className={allClasses} {...props}>
      {header && <div className="border-b border-white/10 pb-4 mb-4">{header}</div>}

      <div>{children}</div>

      {footer && <div className="border-t border-white/10 pt-4 mt-4">{footer}</div>}
    </article>
  );

  // Wrap with Tilt if enabled
  if (tilt) {
    return (
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        perspective={1000}
        scale={1.01}
        transitionSpeed={450}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#38bdf8"
        glarePosition="all"
        className="w-full"
      >
        {cardContent}
      </Tilt>
    );
  }

  return cardContent;
};

export default Card;
