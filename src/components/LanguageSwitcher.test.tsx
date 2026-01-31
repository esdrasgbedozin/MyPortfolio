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
        href: 'http://localhost:4321/fr/projets',
        pathname: '/fr/projets',
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
});
