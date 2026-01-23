/**
 * @fileoverview Tests unitaires pour le service anti-spam Cloudflare Turnstile
 * @module services/TurnstileService.test
 * @epic Epic 2.2 - Anti-Spam Turnstile TDD
 * @task EF-015 - Test vérification Turnstile (RED)
 */

import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { TurnstileService } from './TurnstileService';

// Mock global fetch
global.fetch = vi.fn() as MockedFunction<typeof fetch>;

describe('TurnstileService', () => {
  let service: TurnstileService;
  const mockSecretKey = 'test-secret-key';

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TurnstileService(mockSecretKey);
  });

  describe('verifyToken - Cas Nominal', () => {
    it('should return success true for valid token', async () => {
      const mockResponse = {
        success: true,
        challenge_ts: '2026-01-23T12:00:00.000Z',
        hostname: 'localhost',
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyToken('valid-token', '127.0.0.1');

      expect(result.success).toBe(true);
      expect(result.challengeTs).toBe('2026-01-23T12:00:00.000Z');
      expect(result.hostname).toBe('localhost');
    });

    it('should call Turnstile API with correct parameters', async () => {
      const mockResponse = {
        success: true,
        challenge_ts: '2026-01-23T12:00:00.000Z',
        hostname: 'localhost',
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await service.verifyToken('test-token', '192.168.1.1');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: mockSecretKey,
            response: 'test-token',
            remoteip: '192.168.1.1',
          }),
        }
      );
    });
  });

  describe("verifyToken - Cas d'Erreur", () => {
    it('should return success false for invalid token', async () => {
      const mockResponse = {
        success: false,
        'error-codes': ['invalid-input-response'],
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyToken('invalid-token', '127.0.0.1');

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain('invalid-input-response');
    });

    it('should return success false for expired token', async () => {
      const mockResponse = {
        success: false,
        'error-codes': ['timeout-or-duplicate'],
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyToken('expired-token', '127.0.0.1');

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain('timeout-or-duplicate');
    });

    it('should throw error when API request fails', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(service.verifyToken('test-token', '127.0.0.1')).rejects.toThrow(
        'Turnstile verification failed: Network error'
      );
    });

    it('should throw error when API returns non-200 status', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(service.verifyToken('test-token', '127.0.0.1')).rejects.toThrow(
        'Turnstile API returned 500: Internal Server Error'
      );
    });
  });

  describe('verifyToken - Edge Cases', () => {
    it('should handle missing optional fields in response', async () => {
      const mockResponse = {
        success: true,
        // challenge_ts and hostname are optional
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyToken('test-token', '127.0.0.1');

      expect(result.success).toBe(true);
      expect(result.challengeTs).toBeUndefined();
      expect(result.hostname).toBeUndefined();
    });

    it('should handle multiple error codes', async () => {
      const mockResponse = {
        success: false,
        'error-codes': ['missing-input-secret', 'invalid-input-secret'],
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyToken('test-token', '127.0.0.1');

      expect(result.success).toBe(false);
      expect(result.errorCodes).toHaveLength(2);
      expect(result.errorCodes).toContain('missing-input-secret');
      expect(result.errorCodes).toContain('invalid-input-secret');
    });

    it('should handle empty IP address', async () => {
      const mockResponse = {
        success: true,
        challenge_ts: '2026-01-23T12:00:00.000Z',
        hostname: 'localhost',
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyToken('test-token', '');

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        expect.objectContaining({
          body: expect.stringContaining('"remoteip":""'),
        })
      );
    });
  });

  describe('Service Configuration', () => {
    it('should throw error when secret key is missing', () => {
      expect(() => new TurnstileService('')).toThrow('Turnstile secret key is required');
    });

    it('should accept valid secret key', () => {
      expect(() => new TurnstileService('valid-key')).not.toThrow();
    });
  });
});
