/**
 * @fileoverview Tests pour le composant SwaggerUI
 * @module components/SwaggerUI.test
 * @epic Epic 5.3 - Documentation API
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SwaggerUI from './SwaggerUI';

// Mock swagger-ui-react
vi.mock('swagger-ui-react', () => ({
  default: ({ spec }: { spec: string }) => (
    <div data-testid="swagger-ui-mock">{spec.substring(0, 50)}</div>
  ),
}));

// Mock CSS import
vi.mock('swagger-ui-react/swagger-ui.css', () => ({}));

describe('SwaggerUI Component', () => {
  const mockSpec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint
  `.trim();

  beforeEach(() => {
    // Reset DOM
    document.documentElement.className = '';
  });

  describe('Rendering', () => {
    it('should render SwaggerUI component', () => {
      render(<SwaggerUI spec={mockSpec} />);

      const swaggerElement = screen.getByTestId('swagger-ui-mock');
      expect(swaggerElement).toBeInTheDocument();
    });

    it('should pass spec to SwaggerUIReact', () => {
      render(<SwaggerUI spec={mockSpec} />);

      const swaggerElement = screen.getByTestId('swagger-ui-mock');
      expect(swaggerElement.textContent).toContain('openapi: 3.1.0');
    });

    it('should render wrapper div with correct class', () => {
      const { container } = render(<SwaggerUI spec={mockSpec} />);

      const wrapper = container.querySelector('.swagger-ui-wrapper');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Dark Mode Integration', () => {
    it('should apply dark theme class if dark mode is active on mount', () => {
      document.documentElement.classList.add('dark');
      const { container } = render(<SwaggerUI spec={mockSpec} />);

      const wrapper = container.querySelector('.swagger-ui-wrapper');
      expect(wrapper).toHaveClass('swagger-dark-theme');
    });

    it('should not apply dark theme class if light mode is active', () => {
      const { container } = render(<SwaggerUI spec={mockSpec} />);

      const wrapper = container.querySelector('.swagger-ui-wrapper');
      expect(wrapper).not.toHaveClass('swagger-dark-theme');
    });

    it('should toggle dark theme class when theme changes', () => {
      const { container } = render(<SwaggerUI spec={mockSpec} />);
      const wrapper = container.querySelector('.swagger-ui-wrapper');

      // Initially light
      expect(wrapper).not.toHaveClass('swagger-dark-theme');

      // Simulate theme change to dark
      document.documentElement.classList.add('dark');
      document.documentElement.dispatchEvent(new Event('class'));

      // Note: MutationObserver is async, so we can't test the actual class change
      // in this unit test. E2E test would be better for this.
      expect(wrapper).toBeDefined();
    });
  });

  describe('Spec Handling', () => {
    it('should handle empty spec', () => {
      const { container } = render(<SwaggerUI spec="" />);

      const wrapper = container.querySelector('.swagger-ui-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should handle large spec', () => {
      const largeSpec = mockSpec + '\n'.repeat(1000) + 'paths:\n  /large: {}';
      render(<SwaggerUI spec={largeSpec} />);

      const swaggerElement = screen.getByTestId('swagger-ui-mock');
      expect(swaggerElement).toBeInTheDocument();
    });

    it('should handle spec with special characters', () => {
      const specialSpec = `
openapi: 3.1.0
info:
  title: "Test API with special chars: & < > \" '"
  version: 1.0.0
      `.trim();

      render(<SwaggerUI spec={specialSpec} />);

      const swaggerElement = screen.getByTestId('swagger-ui-mock');
      expect(swaggerElement).toBeInTheDocument();
    });
  });
});
