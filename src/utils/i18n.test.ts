import { describe, it, expect } from 'vitest';
import {
  LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
  getLocaleFromPath,
  getLocalizedPath,
} from './i18n';

describe('i18n Utils', () => {
  describe('Constants', () => {
    it('should have correct locales', () => {
      expect(LOCALES).toEqual(['fr', 'en']);
    });

    it('should have French as default locale', () => {
      expect(DEFAULT_LOCALE).toBe('fr');
    });
  });

  describe('isValidLocale', () => {
    it('should return true for valid locales', () => {
      expect(isValidLocale('fr')).toBe(true);
      expect(isValidLocale('en')).toBe(true);
    });

    it('should return false for invalid locales', () => {
      expect(isValidLocale('es')).toBe(false);
      expect(isValidLocale('de')).toBe(false);
      expect(isValidLocale('')).toBe(false);
    });
  });

  describe('getLocaleFromPath', () => {
    it('should extract locale from path', () => {
      expect(getLocaleFromPath('/fr/projets')).toBe('fr');
      expect(getLocaleFromPath('/en/projects')).toBe('en');
    });

    it('should return default locale for root path', () => {
      expect(getLocaleFromPath('/')).toBe('fr');
    });

    it('should return default locale for invalid locale', () => {
      expect(getLocaleFromPath('/invalid/path')).toBe('fr');
    });

    it('should handle paths without leading slash', () => {
      expect(getLocaleFromPath('fr/projets')).toBe('fr');
      expect(getLocaleFromPath('en/projects')).toBe('en');
    });
  });

  describe('getLocalizedPath', () => {
    it('should create localized path', () => {
      expect(getLocalizedPath('/projets', 'fr')).toBe('/fr/projets');
      expect(getLocalizedPath('/projects', 'en')).toBe('/en/projects');
    });

    it('should handle paths without leading slash', () => {
      expect(getLocalizedPath('projets', 'fr')).toBe('/fr/projets');
      expect(getLocalizedPath('projects', 'en')).toBe('/en/projects');
    });

    it('should handle nested paths', () => {
      expect(getLocalizedPath('/projets/detail', 'fr')).toBe('/fr/projets/detail');
      expect(getLocalizedPath('/projects/detail', 'en')).toBe('/en/projects/detail');
    });
  });
});
