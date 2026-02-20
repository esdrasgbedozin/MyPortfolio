import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber, formatCurrency, formatRelativeTime } from './intl';

describe('Intl Utils', () => {
  describe('formatDate', () => {
    it('should format date in French locale', () => {
      const date = new Date('2026-01-15T12:00:00Z');
      const result = formatDate(date, 'fr');
      expect(result).toBe('15 janvier 2026'); // Format: "DD mois YYYY"
    });

    it('should format date in English locale', () => {
      const date = new Date('2026-01-15T12:00:00Z');
      const result = formatDate(date, 'en');
      expect(result).toBe('January 15, 2026'); // Format: "Month DD, YYYY"
    });

    it('should handle different months', () => {
      const date = new Date('2026-06-20T12:00:00Z');
      expect(formatDate(date, 'fr')).toBe('20 juin 2026');
      expect(formatDate(date, 'en')).toBe('June 20, 2026');
    });

    it('should handle string dates', () => {
      const result = formatDate('2026-01-15', 'fr');
      expect(result).toContain('janvier');
      expect(result).toContain('2026');
    });
  });

  describe('formatNumber', () => {
    it('should format number in French locale (narrow no-break space separator, comma decimal)', () => {
      const result = formatNumber(1234.56, 'fr');
      // FR format uses \u202f (narrow no-break space) as separator
      expect(result).toBe('1\u202f234,56');
    });

    it('should format number in English locale (comma separator, dot decimal)', () => {
      const result = formatNumber(1234.56, 'en');
      expect(result).toBe('1,234.56'); // EN format: virgule + point
    });

    it('should handle large numbers', () => {
      expect(formatNumber(1000000, 'fr')).toBe('1\u202f000\u202f000');
      expect(formatNumber(1000000, 'en')).toBe('1,000,000');
    });

    it('should handle decimals correctly', () => {
      expect(formatNumber(99.99, 'fr')).toBe('99,99');
      expect(formatNumber(99.99, 'en')).toBe('99.99');
    });

    it('should handle integers without decimals', () => {
      expect(formatNumber(100, 'fr')).toBe('100');
      expect(formatNumber(100, 'en')).toBe('100');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in French locale (EUR)', () => {
      const result = formatCurrency(1234.56, 'fr');
      // FR EUR format: "1 234,56 €" (with narrow no-break space)
      expect(result).toContain('€');
      expect(result).toContain('234');
    });

    it('should format currency in English locale (EUR)', () => {
      const result = formatCurrency(1234.56, 'en');
      expect(result).toContain('€');
      expect(result).toContain('1,234.56');
    });

    it('should support USD currency', () => {
      const result = formatCurrency(1234.56, 'en', 'USD');
      expect(result).toContain('$');
      expect(result).toContain('1,234.56');
    });

    it('should handle zero amount', () => {
      const result = formatCurrency(0, 'fr');
      expect(result).toContain('0');
      expect(result).toContain('€');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format today as "today" or equivalent', () => {
      const now = new Date();
      const result = formatRelativeTime(now, 'en');
      expect(result).toBe('today');
    });

    it('should format today in French', () => {
      const now = new Date();
      const result = formatRelativeTime(now, 'fr');
      // Intl may use typographic apostrophe (U+2019) — just check it contains "aujourd"
      expect(result).toContain('aujourd');
    });

    it('should format days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const result = formatRelativeTime(threeDaysAgo, 'en');
      expect(result).toBe('3 days ago');
    });

    it('should format weeks ago', () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const result = formatRelativeTime(twoWeeksAgo, 'en');
      expect(result).toBe('2 weeks ago');
    });

    it('should format months ago', () => {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
      const result = formatRelativeTime(twoMonthsAgo, 'en');
      expect(result).toBe('2 months ago');
    });

    it('should format years ago', () => {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      const result = formatRelativeTime(twoYearsAgo, 'en');
      expect(result).toBe('2 years ago');
    });

    it('should accept string dates', () => {
      const result = formatRelativeTime('2020-01-01', 'en');
      expect(result).toContain('years ago');
    });
  });
});
