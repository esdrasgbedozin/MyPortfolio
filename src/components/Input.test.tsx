import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Input } from './Input';

/**
 * TESTS TDD : Input Component
 * Epic 2.2 - FE-024 : Phase RED
 *
 * Critères :
 * - Accessibilité : label associé, ARIA attributes
 * - Validation : états error/success avec messages
 * - Types : text/email/password/tel/url
 * - Interactions : onChange, onBlur, onFocus
 */
describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input with label', () => {
      render(<Input label="Username" />);

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should render input as input element', () => {
      render(<Input label="Email" />);

      const input = screen.getByLabelText('Email');
      expect(input.tagName).toBe('INPUT');
    });

    it('should apply custom className to wrapper', () => {
      render(<Input label="Name" className="custom-wrapper" />);

      const input = screen.getByLabelText('Name');
      expect(input.parentElement).toHaveClass('custom-wrapper');
    });
  });

  describe('Label', () => {
    it('should render label with correct for attribute', () => {
      render(<Input id="email-input" label="Email" />);

      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email-input');
    });

    it('should auto-generate id when not provided', () => {
      render(<Input label="Password" />);

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('id');
      expect(input.id).toBeTruthy();
    });

    it('should show required indicator when required', () => {
      render(<Input label="Email" required />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Types', () => {
    it('should render text input by default', () => {
      render(<Input label="Name" />);

      const input = screen.getByLabelText('Name');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input label="Email" type="email" />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input label="Password" type="password" />);

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render tel input', () => {
      render(<Input label="Phone" type="tel" />);

      const input = screen.getByLabelText('Phone');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should render url input', () => {
      render(<Input label="Website" type="url" />);

      const input = screen.getByLabelText('Website');
      expect(input).toHaveAttribute('type', 'url');
    });
  });

  describe('States - Error', () => {
    it('should apply error styles when error prop is present', () => {
      render(<Input label="Email" error="Invalid email" />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-[var(--color-error)]');
    });

    it('should display error message', () => {
      render(<Input label="Email" error="Invalid email format" />);

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('should have aria-invalid when error', () => {
      render(<Input label="Email" error="Invalid" />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should link error message with aria-describedby', () => {
      render(<Input id="email" label="Email" error="Invalid" />);

      const input = screen.getByLabelText('Email');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();

      const errorMessage = document.getElementById(errorId!);
      expect(errorMessage).toHaveTextContent('Invalid');
    });
  });

  describe('States - Success', () => {
    it('should apply success styles when success prop is true', () => {
      render(<Input label="Email" success />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-[var(--color-success)]');
    });

    it('should not show success styles by default', () => {
      render(<Input label="Email" />);

      const input = screen.getByLabelText('Email');
      expect(input).not.toHaveClass('border-[var(--color-success)]');
    });
  });

  describe('States - Disabled', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input label="Email" disabled />);

      const input = screen.getByLabelText('Email');
      expect(input).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Input label="Email" disabled />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('opacity-50');
      expect(input).toHaveClass('cursor-not-allowed');
    });
  });

  describe('Placeholder', () => {
    it('should render placeholder', () => {
      render(<Input label="Email" placeholder="john@example.com" />);

      const input = screen.getByPlaceholderText('john@example.com');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Value Control', () => {
    it('should render with value', () => {
      render(<Input label="Name" value="John Doe" onChange={() => {}} />);

      const input = screen.getByLabelText('Name') as HTMLInputElement;
      expect(input.value).toBe('John Doe');
    });

    it('should render with defaultValue', () => {
      render(<Input label="Name" defaultValue="Jane" />);

      const input = screen.getByLabelText('Name') as HTMLInputElement;
      expect(input.value).toBe('Jane');
    });
  });

  describe('Interactions', () => {
    it('should call onChange when typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Input label="Name" onChange={handleChange} />);

      const input = screen.getByLabelText('Name');
      await user.type(input, 'John');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();

      render(<Input label="Name" onFocus={handleFocus} />);

      const input = screen.getByLabelText('Name');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();

      render(<Input label="Name" onBlur={handleBlur} />);

      const input = screen.getByLabelText('Name');
      await user.click(input);
      await user.tab(); // Focus out

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label', () => {
      render(<Input label="Full Name" />);

      const input = screen.getByLabelText('Full Name');
      expect(input).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Input label="Name" aria-label="User full name" />);

      const input = screen.getByLabelText('User full name');
      expect(input).toBeInTheDocument();
    });

    it('should have required attribute when required', () => {
      render(<Input label="Email" required />);

      // Le label contient "Email" + "*", donc on utilise regex
      const input = screen.getByLabelText(/email/i);
      expect(input).toBeRequired();
    });
  });

  describe('Help Text', () => {
    it('should display help text when provided', () => {
      render(<Input label="Password" helpText="Min 8 characters" />);

      expect(screen.getByText('Min 8 characters')).toBeInTheDocument();
    });

    it('should link help text with aria-describedby', () => {
      render(<Input id="password" label="Password" helpText="Min 8 chars" />);

      const input = screen.getByLabelText('Password');
      const helpTextId = input.getAttribute('aria-describedby');
      expect(helpTextId).toBeTruthy();

      const helpText = document.getElementById(helpTextId!);
      expect(helpText).toHaveTextContent('Min 8 chars');
    });
  });

  describe('Styling', () => {
    it('should apply default border color', () => {
      render(<Input label="Name" />);

      const input = screen.getByLabelText('Name');
      expect(input).toHaveClass('border-[var(--color-neutral-700)]');
    });

    it('should apply focus styles', () => {
      render(<Input label="Name" />);

      const input = screen.getByLabelText('Name');
      expect(input).toHaveClass('focus:border-[var(--color-primary-600)]');
      expect(input).toHaveClass('focus:ring-2');
      expect(input).toHaveClass('focus:ring-[var(--color-primary-500)]/20');
    });
  });
});
