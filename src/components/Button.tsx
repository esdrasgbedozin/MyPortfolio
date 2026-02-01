import type { ButtonHTMLAttributes, JSX } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante visuelle du bouton
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';

  /**
   * Taille du bouton
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Composant Button : Bouton atomique avec variants et sizes
 * Respect SOLID & Design Tokens (Dark Mode First)
 * Phase 2: Enhanced with glassmorphism + gradient hover + scale
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  disabled = false,
  children,
  ...props
}: ButtonProps): JSX.Element => {
  // Calcul des classes Tailwind basées sur les design tokens + glassmorphism
  const baseClasses =
    'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 active:scale-95';

  // Variants : respectent les design tokens + glassmorphism + glow
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 focus:ring-primary-500 shadow-lg hover:shadow-primary-500/50',
    secondary:
      'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white hover:from-secondary-500 hover:to-secondary-400 focus:ring-secondary-500 shadow-lg hover:shadow-secondary-500/50',
    ghost:
      'bg-transparent text-neutral-200 hover:bg-neutral-800/50 backdrop-blur-sm focus:ring-neutral-700 border border-transparent hover:border-neutral-700',
    outline:
      'border-2 border-neutral-700 text-neutral-200 bg-transparent hover:bg-neutral-800/50 hover:border-primary-500 focus:ring-neutral-700 backdrop-blur-sm',
  };

  // Sizes : respectent l'échelle de spacing (4-64px)
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm', // px-12, py-6, text-sm
    md: 'px-4 py-2 text-base', // px-16, py-8, text-base
    lg: 'px-6 py-3 text-lg', // px-24, py-12, text-lg
  };

  // État disabled
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const allClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={allClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
