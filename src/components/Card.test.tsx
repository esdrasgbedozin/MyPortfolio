import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Card } from './Card';

/**
 * TESTS TDD : Card Component
 * Epic 2.2 - FE-020 : Phase RED
 *
 * Critères :
 * - Structure : header/body/footer optionnels
 * - Styling : Dark Mode First (design tokens)
 * - Accessibilité : Semantic HTML (article)
 */
describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render card with children', () => {
      render(<Card>Card Content</Card>);

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render as article element by default', () => {
      render(<Card>Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Card className="custom-class">Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Card>Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-[var(--color-neutral-900)]');
      expect(card).toHaveClass('border-[var(--color-neutral-800)]');
    });

    it('should render elevated variant', () => {
      render(<Card variant="elevated">Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-[var(--color-neutral-800)]');
      expect(card).toHaveClass('shadow-lg');
    });

    it('should render outlined variant', () => {
      render(<Card variant="outlined">Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('bg-transparent');
      expect(card).toHaveClass('border-2');
    });
  });

  describe('Padding', () => {
    it('should render default padding', () => {
      render(<Card>Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-6'); // 24px selon spacing scale
    });

    it('should render compact padding', () => {
      render(<Card padding="compact">Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-4'); // 16px
    });

    it('should render comfortable padding', () => {
      render(<Card padding="comfortable">Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-8'); // 32px
    });

    it('should render none padding', () => {
      render(<Card padding="none">Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-0');
    });
  });

  describe('Header Slot', () => {
    it('should render header when provided', () => {
      render(<Card header={<h2>Card Title</h2>}>Body Content</Card>);

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Body Content')).toBeInTheDocument();
    });

    it('should apply header styles', () => {
      render(<Card header={<h2>Title</h2>}>Content</Card>);

      const header = screen.getByText('Title').parentElement;
      expect(header).toHaveClass('border-b');
      expect(header).toHaveClass('border-[var(--color-neutral-800)]');
      expect(header).toHaveClass('pb-4');
    });
  });

  describe('Footer Slot', () => {
    it('should render footer when provided', () => {
      render(<Card footer={<p>Card Actions</p>}>Body Content</Card>);

      expect(screen.getByText('Card Actions')).toBeInTheDocument();
      expect(screen.getByText('Body Content')).toBeInTheDocument();
    });

    it('should apply footer styles', () => {
      render(<Card footer={<p>Actions</p>}>Content</Card>);

      const footer = screen.getByText('Actions').parentElement;
      expect(footer).toHaveClass('border-t');
      expect(footer).toHaveClass('border-[var(--color-neutral-800)]');
      expect(footer).toHaveClass('pt-4');
    });
  });

  describe('Complete Structure', () => {
    it('should render header + body + footer together', () => {
      render(
        <Card header={<h2>Header</h2>} footer={<button>Action</button>}>
          Body Content
        </Card>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body Content')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Card aria-label="Project Card">Content</Card>);

      const card = screen.getByLabelText('Project Card');
      expect(card).toBeInTheDocument();
    });

    it('should be semantic HTML article', () => {
      render(<Card>Content</Card>);

      const card = screen.getByRole('article');
      expect(card.tagName).toBe('ARTICLE');
    });
  });

  describe('Hover State', () => {
    it('should apply hover styles when hoverable', () => {
      render(<Card hoverable>Content</Card>);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('hover:border-[var(--color-primary-600)]');
      expect(card).toHaveClass('transition-colors');
    });

    it('should not apply hover styles by default', () => {
      render(<Card>Content</Card>);

      const card = screen.getByRole('article');
      expect(card).not.toHaveClass('hover:border-[var(--color-primary-600)]');
    });
  });
});
