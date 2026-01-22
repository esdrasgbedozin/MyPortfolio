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
  // Calcul des classes Tailwind basées sur les design tokens
  const baseClasses =
    'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variants : respectent les design tokens définis dans global.css
  const variantClasses = {
    primary:
      'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] focus:ring-[var(--color-primary-500)]',
    secondary:
      'bg-[var(--color-secondary-600)] text-white hover:bg-[var(--color-secondary-700)] focus:ring-[var(--color-secondary-500)]',
    ghost:
      'bg-transparent text-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-800)] focus:ring-[var(--color-neutral-700)]',
    outline:
      'border-2 border-[var(--color-neutral-700)] text-[var(--color-neutral-200)] bg-transparent hover:bg-[var(--color-neutral-800)] focus:ring-[var(--color-neutral-700)]',
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
