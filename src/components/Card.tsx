import type { ReactNode, HTMLAttributes, JSX } from 'react';

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
}

/**
 * Composant Card : Carte atomique avec header/body/footer
 * Respect SOLID & Design Tokens (Dark Mode First)
 */
export const Card = ({
  children,
  header,
  footer,
  variant = 'default',
  padding = 'default',
  hoverable = false,
  className = '',
  ...props
}: CardProps): JSX.Element => {
  // Classes de base (semantic HTML + design tokens)
  const baseClasses = 'rounded-lg border';

  // Variants : respectent les design tokens Dark Mode First
  const variantClasses = {
    default: 'bg-[var(--color-neutral-900)] border-[var(--color-neutral-800)]',
    elevated: 'bg-[var(--color-neutral-800)] border-[var(--color-neutral-700)] shadow-lg',
    outlined: 'bg-transparent border-2 border-[var(--color-neutral-700)]',
  };

  // Padding : respecte spacing scale (4-64px)
  const paddingClasses = {
    none: 'p-0',
    compact: 'p-4', // 16px
    default: 'p-6', // 24px
    comfortable: 'p-8', // 32px
  };

  // Hover effect (optionnel)
  const hoverClasses = hoverable
    ? 'hover:border-[var(--color-primary-600)] transition-colors cursor-pointer'
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

  return (
    <article className={allClasses} {...props}>
      {header && (
        <div className="border-b border-[var(--color-neutral-800)] pb-4 mb-4">{header}</div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="border-t border-[var(--color-neutral-800)] pt-4 mt-4">{footer}</div>
      )}
    </article>
  );
};

export default Card;
