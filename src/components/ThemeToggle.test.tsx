/**
 * FE-066: TEST - ThemeToggle component
 *
 * Critère de Fin: Test React Testing Library toggle theme (RED)
 *
 * Epic 5.1: Theme Toggle (Dark/Light)
 * Phase: TDD RED
 *
 * Tests:
 * - Render theme toggle button
 * - Click toggles theme
 * - Persists theme in localStorage
 * - Updates document class
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle - Epic 5.1 FE-066', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset document classes
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render theme toggle button', () => {
    // ACT
    render(<ThemeToggle />);

    // ASSERT
    const button = screen.getByRole('button', { name: /switch to (light|dark) theme/i });
    expect(button).toBeDefined();
  });

  it('should default to dark theme if no preference stored', () => {
    // ACT
    render(<ThemeToggle />);

    // ASSERT
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme from dark to light on click', () => {
    // ARRANGE
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light theme/i });

    // ACT
    fireEvent.click(button);

    // ASSERT
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('should toggle theme from light to dark on second click', () => {
    // ARRANGE
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light theme/i });

    // ACT
    fireEvent.click(button); // dark → light
    fireEvent.click(button); // light → dark

    // ASSERT
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should persist theme in localStorage on toggle', () => {
    // ARRANGE
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light theme/i });

    // ACT
    fireEvent.click(button); // dark → light

    // ASSERT
    expect(localStorageMock.getItem('theme')).toBe('light');

    // ACT
    fireEvent.click(button); // light → dark

    // ASSERT
    expect(localStorageMock.getItem('theme')).toBe('dark');
  });

  it('should restore theme from localStorage on mount', () => {
    // ARRANGE
    localStorageMock.setItem('theme', 'light');

    // ACT
    render(<ThemeToggle />);

    // ASSERT
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should show sun icon when dark theme active', () => {
    // ARRANGE
    render(<ThemeToggle />);

    // ASSERT - Initial state is dark, should show sun icon (to switch to light)
    const button = screen.getByRole('button', { name: /switch to light theme/i });
    expect(button.textContent).toContain('☀'); // Sun icon for light mode
  });

  it('should show moon icon when light theme active', () => {
    // ARRANGE
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light theme/i });

    // ACT
    fireEvent.click(button); // Switch to light

    // ASSERT - Light theme active, should show moon icon (to switch to dark)
    expect(button.textContent).toContain('🌙'); // Moon icon for dark mode
  });

  it('should have accessible label', () => {
    // ACT
    render(<ThemeToggle />);

    // ASSERT
    const button = screen.getByRole('button', { name: /switch to (light|dark) theme/i });
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });

  it('should update aria-label based on current theme', () => {
    // ARRANGE
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to light theme/i });

    // ASSERT - Dark theme, button switches to light
    expect(button.getAttribute('aria-label')).toContain('light');

    // ACT
    fireEvent.click(button);

    // ASSERT - Light theme, button switches to dark
    expect(button.getAttribute('aria-label')).toContain('dark');
  });
});
