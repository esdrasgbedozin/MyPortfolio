/**
 * Internationalization formatting utilities using native Intl API
 * Epic 7.2 - FE-091b
 *
 * Provides locale-aware date and number formatting for FR/EN
 */

import type { Locale } from './i18n';

/**
 * Format a date according to locale
 * @param date - Date object or ISO string
 * @param locale - Target locale (fr/en)
 * @returns Formatted date string
 * @example
 * formatDate(new Date('2026-01-15'), 'fr') // "15 janvier 2026"
 * formatDate(new Date('2026-01-15'), 'en') // "January 15, 2026"
 */
export function formatDate(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a number according to locale
 * @param value - Number to format
 * @param locale - Target locale (fr/en)
 * @returns Formatted number string
 * @example
 * formatNumber(1234.56, 'fr') // "1 234,56"
 * formatNumber(1234.56, 'en') // "1,234.56"
 */
export function formatNumber(value: number, locale: Locale): string {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a currency amount according to locale
 * @param value - Amount to format
 * @param locale - Target locale (fr/en)
 * @param currency - Currency code (default: EUR)
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56, 'fr') // "1 234,56 €"
 * formatCurrency(1234.56, 'en', 'USD') // "$1,234.56"
 */
export function formatCurrency(value: number, locale: Locale, currency: string = 'EUR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a relative time (e.g., "2 days ago")
 * @param date - Target date
 * @param locale - Target locale (fr/en)
 * @returns Formatted relative time string
 * @example
 * formatRelativeTime(new Date('2026-01-13'), 'fr') // "il y a 2 jours"
 * formatRelativeTime(new Date('2026-01-13'), 'en') // "2 days ago"
 */
export function formatRelativeTime(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffDays === 0) {
    return rtf.format(0, 'day');
  } else if (diffDays < 7) {
    return rtf.format(-diffDays, 'day');
  } else if (diffDays < 30) {
    return rtf.format(-Math.floor(diffDays / 7), 'week');
  } else if (diffDays < 365) {
    return rtf.format(-Math.floor(diffDays / 30), 'month');
  } else {
    return rtf.format(-Math.floor(diffDays / 365), 'year');
  }
}
