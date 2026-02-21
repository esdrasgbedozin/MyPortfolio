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
 * @param path - Path without locale (e.g., '/projects')
 * @param locale - Target locale
 * @returns Localized path (e.g., '/fr/projects')
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}

/**
 * Translation dictionaries
 */
type TranslationDict = Record<string, unknown>;

let frDict: TranslationDict | null = null;
let enDict: TranslationDict | null = null;

/**
 * Load translation dictionary for a locale
 */
async function loadTranslations(locale: Locale): Promise<TranslationDict> {
  if (locale === 'fr') {
    if (!frDict) {
      frDict = (await import('../i18n/fr.json')).default;
    }
    return frDict;
  } else {
    if (!enDict) {
      enDict = (await import('../i18n/en.json')).default;
    }
    return enDict;
  }
}

/**
 * Get nested value from object using dot notation
 * @param obj - Object to search in
 * @param path - Dot-separated path (e.g., 'nav.home')
 * @returns Value or undefined
 */
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Translate a key to the target locale
 * @param key - Translation key (dot notation: 'nav.home')
 * @param locale - Target locale
 * @returns Translated string or key if not found
 */
export async function t(key: string, locale: Locale = DEFAULT_LOCALE): Promise<string> {
  try {
    const dict = await loadTranslations(locale);
    const value = getNestedValue(dict, key);
    return value ?? key;
  } catch {
    // Structured logging not available in browser context — fallback gracefully
    return key;
  }
}

/**
 * Synchronous translation (requires pre-loaded dictionaries)
 * Use only in contexts where async is not possible
 * @param key - Translation key
 * @param locale - Target locale
 * @param dict - Pre-loaded dictionary
 * @returns Translated string or key
 */
export function tSync(key: string, locale: Locale, dict: TranslationDict): string {
  const value = getNestedValue(dict, key);
  return value ?? key;
}
