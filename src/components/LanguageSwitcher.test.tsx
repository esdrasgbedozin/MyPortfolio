import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.pathname
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/fr/projects',
        pathname: '/fr/projects',
      },
    });
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('should render current locale label', () => {
    render(<LanguageSwitcher currentLocale="fr" />);
    // Check textContent without space sensitivity
    expect(screen.getByRole('button').textContent).toContain('FR');
    expect(screen.getByRole('button').textContent).toContain('🇫🇷');
  });

  it('should render EN locale when current is en', () => {
    render(<LanguageSwitcher currentLocale="en" />);
    expect(screen.getByRole('button').textContent).toContain('EN');
    expect(screen.getByRole('button').textContent).toContain('🇬🇧');
  });

  it('should navigate to /en route when clicking on FR switcher', async () => {
    render(<LanguageSwitcher currentLocale="fr" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toContain('/en/');
  });

  it('should navigate to /fr route when clicking on EN switcher', async () => {
    // Set EN path
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/en/projects',
        pathname: '/en/projects',
      },
    });

    render(<LanguageSwitcher currentLocale="en" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toContain('/fr/');
  });

  it('should have accessible label', () => {
    render(<LanguageSwitcher currentLocale="fr" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });

  it('should navigate from /fr homepage to /en homepage', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/fr',
        pathname: '/fr',
      },
    });

    render(<LanguageSwitcher currentLocale="fr" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toBe('/en/');
  });

  it('should swap /fr/skills to /en/skills (symmetric routes)', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/fr/skills',
        pathname: '/fr/skills',
      },
    });

    render(<LanguageSwitcher currentLocale="fr" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toBe('/en/skills');
  });

  it('should swap /en/skills to /fr/skills (symmetric routes)', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/en/skills',
        pathname: '/en/skills',
      },
    });

    render(<LanguageSwitcher currentLocale="en" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toBe('/fr/skills');
  });

  it('should swap /fr/projects to /en/projects', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/fr/projects',
        pathname: '/fr/projects',
      },
    });

    render(<LanguageSwitcher currentLocale="fr" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toBe('/en/projects');
  });

  it('should swap /en/about to /fr/about (symmetric routes)', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/en/about',
        pathname: '/en/about',
      },
    });

    render(<LanguageSwitcher currentLocale="en" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toBe('/fr/about');
  });

  it('should preserve sub-paths (e.g., /fr/projects/my-project)', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:4321/fr/projects/my-project',
        pathname: '/fr/projects/my-project',
      },
    });

    render(<LanguageSwitcher currentLocale="fr" />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(window.location.href).toBe('/en/projects/my-project');
  });
});
