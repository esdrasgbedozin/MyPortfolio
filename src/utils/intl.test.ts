import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber } from './intl';

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
});
