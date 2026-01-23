/**
 * @fileoverview Tests unitaires pour ResendEmailService
 * @module services/email/ResendEmailService.test
 * @epic Epic 2.3 - EmailService Factory + Retry Policy
 * @task EF-020 - Test envoi email Resend (RED)
 */

import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { ResendEmailService } from './ResendEmailService';
import type { EmailPayload } from './EmailService';

// Mock Resend SDK
vi.mock('resend', () => {
  const mockSend = vi.fn();
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend,
      };
    },
  };
});

describe('ResendEmailService', () => {
  let service: ResendEmailService;
  let mockSend: MockedFunction<
    (args: unknown) => Promise<{ data: { id: string } | null; error: { message: string } | null }>
  >;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { Resend } = await import('resend');
    service = new ResendEmailService('test-api-key');
    mockSend = new Resend('').emails.send as never;
  });

  describe('send - Cas Nominal', () => {
    it('should send email successfully with all fields', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_123456' },
        error: null,
      });

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test text',
        replyTo: 'reply@example.com',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg_123456');
      expect(result.error).toBeUndefined();
    });

    it('should call Resend API with correct parameters', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_123456' },
        error: null,
      });

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      };

      await service.send(payload);

      expect(mockSend).toHaveBeenCalledWith({
        to: 'recipient@example.com',
        from: expect.any(String),
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
        reply_to: undefined,
      });
    });

    it('should use default from address if not provided', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_123456' },
        error: null,
      });

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      };

      await service.send(payload);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@portfolio.dev',
        })
      );
    });
  });

  describe("send - Cas d'Erreur", () => {
    it('should return error when Resend API fails', async () => {
      mockSend.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid API key' },
      });

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid API key');
    });

    it('should handle network errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('Network timeout'));

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network timeout');
    });

    it('should handle rate limit errors', async () => {
      mockSend.mockResolvedValueOnce({
        data: null,
        error: { message: 'Rate limit exceeded' },
      });

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rate limit exceeded');
    });
  });

  describe('send - Edge Cases', () => {
    it('should handle missing text field (HTML only)', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_123456' },
        error: null,
      });

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        subject: 'Test',
        html: '<p>Test HTML</p>',
        text: '', // Empty text
      };

      const result = await service.send(payload);

      expect(result.success).toBe(true);
    });

    it('should handle special characters in subject', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_123456' },
        error: null,
      });

      const payload: EmailPayload = {
        to: 'recipient@example.com',
        subject: 'Test éàü 日本語 🎉',
        html: '<p>Test</p>',
        text: 'Test',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Test éàü 日本語 🎉',
        })
      );
    });

    it('should handle multiple recipients (comma-separated)', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_123456' },
        error: null,
      });

      const payload: EmailPayload = {
        to: 'user1@example.com, user2@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(true);
    });
  });

  describe('Service Configuration', () => {
    it('should throw error when API key is missing', () => {
      expect(() => new ResendEmailService('')).toThrow('Resend API key is required');
    });

    it('should accept valid API key', () => {
      expect(() => new ResendEmailService('valid-key')).not.toThrow();
    });

    it('should accept custom default from address', () => {
      const customService = new ResendEmailService('test-key', 'custom@example.com');
      expect(customService).toBeDefined();
    });
  });
});
