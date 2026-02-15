/**
 * Tests pour l'endpoint /api/contact.json
 * Epic 3.1 - EF-030 à EF-032
 *
 * Cas nominal :
 * - Validation du payload (ValidationService)
 * - Vérification du token Turnstile (TurnstileService)
 * - Rate limiting par IP (RateLimitService)
 * - Envoi d'email (EmailService)
 * - Retour 200 avec message de succès
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { APIContext } from 'astro';
import { POST } from '../../src/pages/api/contact.json';

// Mock environment variables
vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret-key');
vi.stubEnv('EMAIL_FROM', 'noreply@test.com');
vi.stubEnv('CONTACT_RECIPIENT_EMAIL', 'contact@test.com');
vi.stubEnv('RESEND_API_KEY', 'test-resend-key');

// Mock all services
vi.mock('../../src/services/ContactService', () => ({
  ContactService: vi.fn(function () {
    return {
      processContactRequest: vi.fn().mockResolvedValue({
        success: true,
      }),
    };
  }),
}));

describe('POST /api/contact.json - Epic 3.1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('EF-030: Cas nominal (200 OK)', () => {
    it('should return 200 when all services succeed', async () => {
      // Arrange: Mock request with valid payload
      const mockRequest = {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
        }),
        json: async () => ({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello, this is a test message',
          turnstileToken: 'valid-token-123',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act: Call the handler
      const response = await POST(mockContext as APIContext);

      // Assert: Should return 200 with success message
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        success: true,
        message: 'Message envoyé avec succès',
      });
    });

    it('should call ContactService to process request', async () => {
      // Arrange
      const { ContactService } = await import('../../src/services/ContactService');

      const mockRequest = {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test',
          turnstileToken: 'token',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act
      await POST(mockContext as APIContext);

      // Assert: ContactService should have been instantiated
      expect(ContactService).toHaveBeenCalled();
    });

    it('should call TurnstileService to verify token', async () => {
      // This test is now handled by ContactService
      // Keeping for backward compatibility but testing through service
      const mockRequest = {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test',
          turnstileToken: 'valid-token-123',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act
      const response = await POST(mockContext as APIContext);

      // Assert: Should return 200 (service handles Turnstile internally)
      expect(response.status).toBe(200);
    });

    it('should call RateLimitService to check IP rate limit', async () => {
      // This test is now handled by ContactService
      const mockRequest = {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test',
          turnstileToken: 'token',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act
      const response = await POST(mockContext as APIContext);

      // Assert: Should return 200 (service handles rate limit internally)
      expect(response.status).toBe(200);
    });

    it('should call EmailService to send email', async () => {
      // This test is now handled by ContactService
      const mockRequest = {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
          turnstileToken: 'token',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act
      const response = await POST(mockContext as APIContext);

      // Assert: Should return 200 (service handles email internally)
      expect(response.status).toBe(200);
    });
  });

  describe('Content-Type validation', () => {
    it('should handle missing content-type gracefully', async () => {
      // Arrange: Request without explicit content-type
      const mockRequest = {
        method: 'POST',
        headers: new Headers(),
        json: async () => ({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test',
          turnstileToken: 'token',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act
      const response = await POST(mockContext as APIContext);

      // Assert: Should still process (body parsing handles it)
      expect(response.status).toBe(200);
    });
  });
});
