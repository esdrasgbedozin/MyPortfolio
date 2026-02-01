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
 * Phase 2: Enhanced with glassmorphism + shimmer
 */
export const Badge = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps): JSX.Element => {
  // Classes de base : inline-flex pour alignement contenu + glassmorphism
  const baseClasses =
    'inline-flex items-center justify-center rounded-full font-medium backdrop-blur-sm border transition-all duration-200 hover:scale-105';

  // Variants : respectent semantic colors des design tokens + glassmorphism
  const variantClasses = {
    default:
      'bg-neutral-800/50 text-[var(--color-neutral-200)] border-neutral-700/50 hover:border-neutral-600',
    success: 'bg-green-500/20 text-green-400 border-green-500/30 hover:border-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:border-yellow-400',
    error: 'bg-red-500/20 text-red-400 border-red-500/30 hover:border-red-400',
    info: 'bg-primary-500/20 text-primary-400 border-primary-500/30 hover:border-primary-400',
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
