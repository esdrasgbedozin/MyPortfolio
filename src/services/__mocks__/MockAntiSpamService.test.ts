/**
 * @fileoverview Tests unitaires pour MockAntiSpamService
 * @module services/__mocks__/MockAntiSpamService.test
 * @epic Epic 2.2 - Anti-Spam Turnstile TDD
 * @task EF-018 - Mock Turnstile pour tests (GREEN)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockAntiSpamService } from './MockAntiSpamService';

describe('MockAntiSpamService', () => {
  let service: MockAntiSpamService;

  beforeEach(() => {
    service = new MockAntiSpamService();
  });

  describe('Default Behavior', () => {
    it('should return success true by default', async () => {
      const result = await service.verifyToken('test-token', '127.0.0.1');

      expect(result.success).toBe(true);
      expect(result.challengeTs).toBeDefined();
      expect(result.hostname).toBe('localhost');
    });

    it('should ignore token and IP parameters', async () => {
      const result1 = await service.verifyToken('token1', '1.1.1.1');
      const result2 = await service.verifyToken('token2', '2.2.2.2');

      expect(result1.success).toBe(result2.success);
    });
  });

  describe('Custom Mock Response', () => {
    it('should return custom mock response when configured', async () => {
      service.setMockResponse({
        success: false,
        errorCodes: ['invalid-input-response'],
      });

      const result = await service.verifyToken('test-token', '127.0.0.1');

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain('invalid-input-response');
    });

    it('should persist custom response across multiple calls', async () => {
      service.setMockResponse({ success: false, errorCodes: ['timeout-or-duplicate'] });

      const result1 = await service.verifyToken('test-token', '127.0.0.1');
      const result2 = await service.verifyToken('test-token', '127.0.0.1');

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to default response after custom configuration', async () => {
      service.setMockResponse({ success: false, errorCodes: ['error'] });
      service.reset();

      const result = await service.verifyToken('test-token', '127.0.0.1');

      expect(result.success).toBe(true);
      expect(result.errorCodes).toBeUndefined();
    });
  });

  describe('Interface Compliance', () => {
    it('should implement AntiSpamService interface', () => {
      expect(service.verifyToken).toBeDefined();
      expect(typeof service.verifyToken).toBe('function');
    });

    it('should return a Promise', () => {
      const result = service.verifyToken('test', '127.0.0.1');
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
