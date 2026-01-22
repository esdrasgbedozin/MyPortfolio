import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Badge } from './Badge';

/**
 * TESTS TDD : Badge Component
 * Epic 2.2 - FE-022 : Phase RED
 *
 * Critères :
 * - Variants : success/warning/error/info/default
 * - Sizes : sm/md
 * - Accessibilité : aria-label
 */
describe('Badge Component', () => {
  describe('Rendering', () => {
    it('should render badge with text', () => {
      render(<Badge>Status</Badge>);

      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render as span element', () => {
      render(<Badge>Badge</Badge>);

      const badge = screen.getByText('Badge');
      expect(badge.tagName).toBe('SPAN');
    });

    it('should apply custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>);

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('Variants - Semantic Colors', () => {
    it('should render default variant', () => {
      render(<Badge>Default</Badge>);

      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('bg-[var(--color-neutral-800)]');
      expect(badge).toHaveClass('text-[var(--color-neutral-200)]');
    });

    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>);

      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-[var(--color-success)]');
      expect(badge).toHaveClass('text-white');
    });

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);

      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-[var(--color-warning)]');
      expect(badge).toHaveClass('text-[var(--color-neutral-900)]');
    });

    it('should render error variant', () => {
      render(<Badge variant="error">Error</Badge>);

      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-[var(--color-error)]');
      expect(badge).toHaveClass('text-white');
    });

    it('should render info variant', () => {
      render(<Badge variant="info">Info</Badge>);

      const badge = screen.getByText('Info');
      expect(badge).toHaveClass('bg-[var(--color-primary-600)]');
      expect(badge).toHaveClass('text-white');
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Badge size="sm">Small</Badge>);

      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-2'); // 8px
      expect(badge).toHaveClass('py-0.5'); // 2px
      expect(badge).toHaveClass('text-xs'); // 12px
    });

    it('should render medium size by default', () => {
      render(<Badge>Medium</Badge>);

      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-3'); // 12px
      expect(badge).toHaveClass('py-1'); // 4px
      expect(badge).toHaveClass('text-sm'); // 14px
    });

    it('should render medium size explicitly', () => {
      render(<Badge size="md">Medium</Badge>);

      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-3');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('text-sm');
    });
  });

  describe('Shape', () => {
    it('should render rounded by default', () => {
      render(<Badge>Badge</Badge>);

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have inline-flex display', () => {
      render(<Badge>Badge</Badge>);

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('justify-center');
    });
  });

  describe('Typography', () => {
    it('should render with font-medium', () => {
      render(<Badge>Badge</Badge>);

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('font-medium');
    });
  });

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Badge aria-label="Status badge">Active</Badge>);

      const badge = screen.getByLabelText('Status badge');
      expect(badge).toBeInTheDocument();
    });

    it('should support role attribute', () => {
      render(<Badge role="status">Online</Badge>);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Combined Variants', () => {
    it('should render success + small', () => {
      render(
        <Badge variant="success" size="sm">
          OK
        </Badge>
      );

      const badge = screen.getByText('OK');
      expect(badge).toHaveClass('bg-[var(--color-success)]');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('text-xs');
    });

    it('should render error + custom class', () => {
      render(
        <Badge variant="error" className="ml-2">
          Failed
        </Badge>
      );

      const badge = screen.getByText('Failed');
      expect(badge).toHaveClass('bg-[var(--color-error)]');
      expect(badge).toHaveClass('ml-2');
    });
  });
});
