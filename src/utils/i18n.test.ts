import { describe, it, expect } from 'vitest';
import {
  LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
  getLocaleFromPath,
  getLocalizedPath,
  tSync,
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
      expect(getLocaleFromPath('/fr/projects')).toBe('fr');
      expect(getLocaleFromPath('/en/projects')).toBe('en');
    });

    it('should return default locale for root path', () => {
      expect(getLocaleFromPath('/')).toBe('fr');
    });

    it('should return default locale for invalid locale', () => {
      expect(getLocaleFromPath('/invalid/path')).toBe('fr');
    });

    it('should handle paths without leading slash', () => {
      expect(getLocaleFromPath('fr/projects')).toBe('fr');
      expect(getLocaleFromPath('en/projects')).toBe('en');
    });
  });

  describe('getLocalizedPath', () => {
    it('should create localized path', () => {
      expect(getLocalizedPath('/projects', 'fr')).toBe('/fr/projects');
      expect(getLocalizedPath('/projects', 'en')).toBe('/en/projects');
    });

    it('should handle paths without leading slash', () => {
      expect(getLocalizedPath('projects', 'fr')).toBe('/fr/projects');
      expect(getLocalizedPath('projects', 'en')).toBe('/en/projects');
    });

    it('should handle nested paths', () => {
      expect(getLocalizedPath('/projects/detail', 'fr')).toBe('/fr/projects/detail');
      expect(getLocalizedPath('/projects/detail', 'en')).toBe('/en/projects/detail');
    });
  });

  describe('tSync', () => {
    it('should translate simple keys', () => {
      const frDict = { nav: { home: 'Accueil' } };
      const enDict = { nav: { home: 'Home' } };

      expect(tSync('nav.home', 'fr', frDict)).toBe('Accueil');
      expect(tSync('nav.home', 'en', enDict)).toBe('Home');
    });

    it('should return key if translation not found', () => {
      const dict = {};
      expect(tSync('unknown.key', 'fr', dict)).toBe('unknown.key');
    });

    it('should handle nested keys', () => {
      const dict = { footer: { social: { github: 'Voir mon profil GitHub' } } };
      expect(tSync('footer.social.github', 'fr', dict)).toBe('Voir mon profil GitHub');
    });
  });
});
