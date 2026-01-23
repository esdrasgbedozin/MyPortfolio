import { useId, type InputHTMLAttributes, type JSX } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label du champ (obligatoire pour accessibilité)
   */
  label: string;

  /**
   * Message d'erreur (affiche styles error)
   */
  error?: string;

  /**
   * État de succès (affiche styles success)
   * @default false
   */
  success?: boolean;

  /**
   * Texte d'aide affiché sous le champ
   */
  helpText?: string;
}

/**
 * Composant Input : Champ de formulaire accessible avec label/error/help
 * Respect SOLID & WCAG 2.1 AA (ARIA labels, error messages)
 */
export const Input = ({
  label,
  error,
  success = false,
  helpText,
  id: providedId,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  ...props
}: InputProps): JSX.Element => {
  // Auto-génération d'ID si non fourni (accessibilité)
  const autoId = useId();
  const inputId = providedId || autoId;

  // IDs pour aria-describedby (error ou helpText)
  const errorId = error ? `${inputId}-error` : undefined;
  const helpTextId = helpText ? `${inputId}-help` : undefined;
  const describedBy = errorId || helpTextId;

  // Classes wrapper
  const wrapperClasses = ['flex flex-col gap-1', className].filter(Boolean).join(' ');

  // Classes label
  const labelClasses = 'text-sm font-medium text-[var(--color-neutral-200)]';

  // Classes input : base + état (error/success/disabled)
  const baseInputClasses =
    'w-full px-4 py-2 rounded-lg border bg-[var(--color-neutral-900)] text-[var(--color-neutral-100)] placeholder:text-[var(--color-neutral-600)] transition-colors focus:outline-none focus:ring-2';

  const stateClasses = error
    ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20'
    : success
      ? 'border-[var(--color-success)] focus:border-[var(--color-success)] focus:ring-[var(--color-success)]/20'
      : 'border-[var(--color-neutral-700)] focus:border-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]/20';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const inputClasses = [baseInputClasses, stateClasses, disabledClasses].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {/* Label avec required indicator */}
      <label htmlFor={inputId} className={labelClasses}>
        {label}
        {required && <span className="text-[var(--color-error)] ml-1">*</span>}
      </label>

      {/* Input field */}
      <input
        id={inputId}
        type={type}
        required={required}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
      />

      {/* Error message */}
      {error && (
        <span id={errorId} className="text-sm text-[var(--color-error)]" role="alert">
          {error}
        </span>
      )}

      {/* Help text (si pas d'erreur) */}
      {!error && helpText && (
        <span id={helpTextId} className="text-sm text-[var(--color-neutral-500)]">
          {helpText}
        </span>
      )}
    </div>
  );
};

export default Input;
