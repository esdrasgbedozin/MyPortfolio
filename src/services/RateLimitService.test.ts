/**
 * @fileoverview Tests unitaires pour RateLimitService
 * @module services/RateLimitService.test
 * @epic Epic 2.4 - RateLimitService TDD
 * @task EF-027 - Test rate limiting IP (RED)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RateLimitService } from './RateLimitService';

describe('RateLimitService', () => {
  let service: RateLimitService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new RateLimitService(5, 3600000); // 5 req/heure
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isRateLimited - Cas Nominal', () => {
    it('should allow first request', async () => {
      const result = await service.isRateLimited('192.168.1.1');

      expect(result.limited).toBe(false);
      expect(result.remainingRequests).toBe(4);
      expect(result.resetAt).toBeDefined();
    });

    it('should allow up to maxRequests', async () => {
      const ip = '192.168.1.1';

      for (let i = 0; i < 5; i++) {
        const result = await service.isRateLimited(ip);
        expect(result.limited).toBe(false);
        expect(result.remainingRequests).toBe(4 - i);
      }
    });

    it('should block 6th request within window', async () => {
      const ip = '192.168.1.1';

      // 5 premières requêtes OK
      for (let i = 0; i < 5; i++) {
        await service.isRateLimited(ip);
      }

      // 6ème requête bloquée
      const result = await service.isRateLimited(ip);

      expect(result.limited).toBe(true);
      expect(result.remainingRequests).toBe(0);
      expect(result.retryAfter).toBeDefined();
    });

    it('should track different IPs separately', async () => {
      await service.isRateLimited('192.168.1.1');
      await service.isRateLimited('192.168.1.2');

      const result1 = await service.isRateLimited('192.168.1.1');
      const result2 = await service.isRateLimited('192.168.1.2');

      expect(result1.remainingRequests).toBe(3);
      expect(result2.remainingRequests).toBe(3);
    });
  });

  describe('isRateLimited - Window Reset', () => {
    it('should reset counter after time window expires', async () => {
      const ip = '192.168.1.1';

      // Épuiser les 5 requêtes
      for (let i = 0; i < 5; i++) {
        await service.isRateLimited(ip);
      }

      // Vérifier blocage
      const blockedResult = await service.isRateLimited(ip);
      expect(blockedResult.limited).toBe(true);

      // Avancer le temps de 1 heure + 1 seconde
      vi.advanceTimersByTime(3600000 + 1000);

      // Nouvelle requête devrait passer
      const newResult = await service.isRateLimited(ip);
      expect(newResult.limited).toBe(false);
      expect(newResult.remainingRequests).toBe(4);
    });

    it('should return correct retryAfter value', async () => {
      const ip = '192.168.1.1';

      // Épuiser les 5 requêtes
      for (let i = 0; i < 5; i++) {
        await service.isRateLimited(ip);
      }

      // Bloquer
      const result = await service.isRateLimited(ip);

      expect(result.retryAfter).toBeLessThanOrEqual(3600);
      expect(result.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';

      await service.isRateLimited(ip1);
      await service.isRateLimited(ip2);

      // Avancer le temps de 1 heure + 1 seconde
      vi.advanceTimersByTime(3600000 + 1000);

      // Cleanup manuel
      await service.cleanup();

      // Les entrées devraient être supprimées
      const result1 = await service.isRateLimited(ip1);
      const result2 = await service.isRateLimited(ip2);

      expect(result1.remainingRequests).toBe(4); // Compteur réinitialisé
      expect(result2.remainingRequests).toBe(4); // Compteur réinitialisé
    });

    it('should not remove active entries', async () => {
      const ip = '192.168.1.1';

      await service.isRateLimited(ip);
      await service.isRateLimited(ip);

      // Cleanup immédiat (entrée encore active)
      await service.cleanup();

      // L'entrée devrait être conservée
      const result = await service.isRateLimited(ip);

      expect(result.remainingRequests).toBe(2); // Compteur à 2 (3ème requête)
    });
  });

  describe('Configuration', () => {
    it('should respect custom maxRequests', async () => {
      const customService = new RateLimitService(3, 3600000);
      const ip = '192.168.1.1';

      // 3 requêtes autorisées
      for (let i = 0; i < 3; i++) {
        const result = await customService.isRateLimited(ip);
        expect(result.limited).toBe(false);
      }

      // 4ème bloquée
      const result = await customService.isRateLimited(ip);
      expect(result.limited).toBe(true);
    });

    it('should respect custom windowMs', async () => {
      const customService = new RateLimitService(5, 1000); // 1 seconde
      const ip = '192.168.1.1';

      // Épuiser les requêtes
      for (let i = 0; i < 5; i++) {
        await customService.isRateLimited(ip);
      }

      // Bloquer
      const blockedResult = await customService.isRateLimited(ip);
      expect(blockedResult.limited).toBe(true);

      // Avancer de 1 seconde + 1ms
      vi.advanceTimersByTime(1001);

      // Devrait passer
      const newResult = await customService.isRateLimited(ip);
      expect(newResult.limited).toBe(false);
    });
  });
});
