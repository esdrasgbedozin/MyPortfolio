import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Hero from './Hero';

describe('Hero Component', () => {
  describe('Content Display', () => {
    it('should render title', () => {
      const { getByRole } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
        />
      );

      const heading = getByRole('heading', { level: 1 });
      expect(heading).toBeDefined();
      expect(heading.textContent).toBe('John Doe');
    });

    it('should render tagline', () => {
      const { getByText } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
        />
      );

      expect(getByText('Software Engineer')).toBeDefined();
    });

    it('should render description', () => {
      const { getByText } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
        />
      );

      expect(getByText('Building amazing web applications')).toBeDefined();
    });
  });

  describe('CTA Buttons', () => {
    it('should render primary CTA with correct link', () => {
      const { getByRole } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
          primaryCta={{ label: 'View Projects', href: '/fr/projects' }}
        />
      );

      const link = getByRole('link', { name: 'View Projects' });
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('/fr/projects');
    });

    it('should render secondary CTA with correct link', () => {
      const { getByRole } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
          secondaryCta={{ label: 'Contact Me', href: '/fr/contact' }}
        />
      );

      const link = getByRole('link', { name: 'Contact Me' });
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('/fr/contact');
    });

    it('should render both CTAs when provided', () => {
      const { getAllByRole } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
          primaryCta={{ label: 'View Projects', href: '/fr/projects' }}
          secondaryCta={{ label: 'Contact Me', href: '/fr/contact' }}
        />
      );

      const links = getAllByRole('link');
      expect(links).toHaveLength(2);
    });

    it('should render without CTAs when not provided', () => {
      const { queryAllByRole } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
        />
      );

      const links = queryAllByRole('link');
      expect(links).toHaveLength(0);
    });
  });

  describe('Styling', () => {
    it('should have correct semantic structure', () => {
      const { container } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
        />
      );

      const section = container.querySelector('section');
      expect(section).toBeDefined();
    });

    it('should have min-height for viewport coverage', () => {
      const { container } = render(
        <Hero
          title="John Doe"
          tagline="Software Engineer"
          description="Building amazing web applications"
        />
      );

      const section = container.querySelector('section');
      expect(section?.className).toContain('min-h-screen');
    });
  });
});
