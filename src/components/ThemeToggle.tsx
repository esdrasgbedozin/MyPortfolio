/**
 * ThemeToggle Component - Epic 5.1 (FE-067, FE-069)
 *
 * React Island pour basculer entre thème dark/light.
 * - Auto-détecte la préférence système (prefers-color-scheme)
 * - Persiste la préférence dans localStorage
 * - Applique le thème via documentElement.classList
 * - Accessible (ARIA labels dynamiques)
 *
 * @module components/ThemeToggle
 */

import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'theme';

/**
 * Détecte la préférence de thème système
 */
function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  // FE-069: Restore theme from localStorage OR auto-detect system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // No user preference stored, use system preference
      const systemTheme = getSystemTheme();
      setTheme(systemTheme);
    }
  }, []);

  // Apply theme to document and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';
  const ariaLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className="theme-toggle p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      type="button"
    >
      {isDark ? '☀' : '🌙'}
    </button>
  );
}
