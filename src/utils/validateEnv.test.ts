import { describe, it, expect } from 'vitest';
import { validateEnv } from './validateEnv';

/**
 * EF-052: TEST env vars manquantes
 *
 * Critère de Fin: Test throw error si RESEND_API_KEY ou TURNSTILE_SECRET_KEY absent (RED → GREEN)
 *
 * Epic 4.4: Variables d'Environnement
 * Phase: TDD GREEN
 */

describe('validateEnv - Epic 4.4', () => {
  describe('EF-052: Required environment variables', () => {
    it('should throw error when RESEND_API_KEY is missing', () => {
      // ARRANGE
      const env = {
        TURNSTILE_SECRET_KEY: '0x4test_key',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).toThrow('RESEND_API_KEY');
    });

    it('should throw error when TURNSTILE_SECRET_KEY is missing', () => {
      // ARRANGE
      const env = {
        RESEND_API_KEY: 're_test_key',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).toThrow('TURNSTILE_SECRET_KEY');
    });

    it('should throw error when both required vars are missing', () => {
      // ARRANGE
      const env = {};

      // ACT & ASSERT
      expect(() => validateEnv(env)).toThrow(); // Any error is acceptable
    });

    it('should NOT throw when all required vars are present', () => {
      // ARRANGE
      const env = {
        RESEND_API_KEY: 're_test_key',
        TURNSTILE_SECRET_KEY: '0x4test_key',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).not.toThrow();
    });
  });

  describe('Optional environment variables', () => {
    it('should NOT throw when SENTRY_DSN is missing (optional)', () => {
      // ARRANGE
      const env = {
        RESEND_API_KEY: 're_test_key',
        TURNSTILE_SECRET_KEY: '0x4test_key',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).not.toThrow();
    });

    it('should accept SENTRY_DSN when present', () => {
      // ARRANGE
      const env = {
        RESEND_API_KEY: 're_test_key',
        TURNSTILE_SECRET_KEY: '0x4test_key',
        SENTRY_DSN: 'https://xxx@xxx.ingest.sentry.io/xxx',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).not.toThrow();
    });
  });

  describe('Environment variable formats', () => {
    it('should throw when RESEND_API_KEY does not start with "re_"', () => {
      // ARRANGE
      const env = {
        RESEND_API_KEY: 'invalid_key_format',
        TURNSTILE_SECRET_KEY: '0x4test_key',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).toThrow('RESEND_API_KEY must start with "re_"');
    });

    it('should throw when TURNSTILE_SECRET_KEY does not start with "0x"', () => {
      // ARRANGE
      const env = {
        RESEND_API_KEY: 're_test_key',
        TURNSTILE_SECRET_KEY: 'invalid_format',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).toThrow('TURNSTILE_SECRET_KEY must start with "0x"');
    });

    it('should throw when SENTRY_DSN has invalid URL format', () => {
      // ARRANGE
      const env = {
        RESEND_API_KEY: 're_test_key',
        TURNSTILE_SECRET_KEY: '0x4test_key',
        SENTRY_DSN: 'not-a-valid-url',
      };

      // ACT & ASSERT
      expect(() => validateEnv(env)).toThrow('SENTRY_DSN must be a valid URL');
    });
  });
});
