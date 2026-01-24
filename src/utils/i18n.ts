/**
 * i18n Types and Utilities
 * Provides type-safe internationalization support for FR/EN locales
 */

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

/**
 * Get locale from URL path
 * @param pathname - URL pathname (e.g., '/fr/projets')
 * @returns Locale or default locale
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return DEFAULT_LOCALE;
}

/**
 * Get localized path
 * @param path - Path without locale (e.g., '/projets')
 * @param locale - Target locale
 * @returns Localized path (e.g., '/fr/projets')
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}
