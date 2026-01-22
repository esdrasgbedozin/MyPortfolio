import type { HTMLAttributes, JSX } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Variante sémantique du badge
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Taille du badge
   * @default 'md'
   */
  size?: 'sm' | 'md';
}

/**
 * Composant Badge : Badge atomique avec semantic colors
 * Respect SOLID & Design Tokens (Dark Mode First)
 */
export const Badge = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps): JSX.Element => {
  // Classes de base : inline-flex pour alignement contenu
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium';

  // Variants : respectent semantic colors des design tokens
  const variantClasses = {
    default: 'bg-[var(--color-neutral-800)] text-[var(--color-neutral-200)]',
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-[var(--color-neutral-900)]',
    error: 'bg-[var(--color-error)] text-white',
    info: 'bg-[var(--color-primary-600)] text-white',
  };

  // Sizes : respectent spacing scale (4-64px)
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs', // px-8, py-2, text-12px
    md: 'px-3 py-1 text-sm', // px-12, py-4, text-14px
  };

  const allClasses = [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={allClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;
