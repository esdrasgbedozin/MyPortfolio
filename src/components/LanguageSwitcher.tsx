/**
 * LanguageSwitcher Component - Epic 7.3 FE-092
 *
 * Composant React pour switcher entre FR/EN
 * Utilise navigation côté client pour changer de locale
 */

import { useState } from 'react';
import type { Locale } from '../utils/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

const LOCALE_CONFIG = {
  fr: { flag: '🇫🇷', label: 'FR', ariaLabel: 'Switch to English' },
  en: { flag: '🇬🇧', label: 'EN', ariaLabel: 'Passer au français' },
} as const;

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps): React.JSX.Element {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLanguageSwitch = (): void => {
    setIsTransitioning(true);

    // Determine target locale
    const targetLocale: Locale = currentLocale === 'fr' ? 'en' : 'fr';

    // Get current pathname
    const currentPath = window.location.pathname;

    // Replace locale in path
    const newPath = currentPath.replace(`/${currentLocale}/`, `/${targetLocale}/`);

    // Navigate to new locale path
    window.location.href = newPath;
  };

  const config = LOCALE_CONFIG[currentLocale];

  return (
    <button
      onClick={handleLanguageSwitch}
      disabled={isTransitioning}
      aria-label={config.ariaLabel}
      className="
        flex items-center gap-2 px-3 py-2 rounded-lg
        text-[var(--color-neutral-200)] 
        hover:bg-[var(--color-neutral-800)] 
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      <span aria-hidden="true">{config.flag}</span>
      <span className="font-medium">{config.label}</span>
    </button>
  );
}
