/**
 * Tests d'intégration pour les cas d'erreur de l'API Contact
 * Epic 3.2 - EF-033, EF-035, EF-037, EF-039
 *
 * Tests RED pour valider la gestion des erreurs RFC 7807
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { APIContext } from 'astro';
import { POST } from '../../src/pages/api/contact';
import {
  ValidationError,
  TurnstileError,
  RateLimitError,
  EmailError,
} from '../../src/errors/ApiError';

// Mock ContactService with different behaviors per test
const mockProcessContactRequest = vi.fn();

vi.mock('../../src/services/ContactService', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ContactService: vi.fn(function (this: any) {
      this.processContactRequest = mockProcessContactRequest;
    }),
  };
});

describe('POST /api/contact - Epic 3.2 Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('EF-033: Validation error (400)', () => {
    it('should return 400 with RFC 7807 format when validation fails', async () => {
      // Arrange: Mock processContactRequest to throw ValidationError
      mockProcessContactRequest.mockRejectedValue(
        new ValidationError(
          'Validation failed for one or more fields',
          {
            email: ['Invalid email format'],
            message: ['Message is too short'],
          },
          '/api/contact'
        )
      );

      const mockRequest = {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          name: 'John',
          email: 'invalid-email',
          message: 'Hi',
          turnstileToken: 'token',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act
      const response = await POST(mockContext as APIContext);

      // Assert: Should return 400 with RFC 7807 Problem Details
      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      const body = await response.json();
      expect(body).toMatchObject({
        type: expect.stringContaining('validation-error'),
        title: 'Validation Failed',
        status: 400,
        detail: expect.any(String),
        fieldErrors: {
          email: ['Invalid email format'],
          message: ['Message is too short'],
        },
      });
    });
  });

  describe('EF-035: Turnstile error (403)', () => {
    it('should return 403 with RFC 7807 format when Turnstile verification fails', async () => {
      // Arrange: Mock processContactRequest to throw TurnstileError
      mockProcessContactRequest.mockRejectedValue(
        new TurnstileError('Anti-spam verification failed. Please try again.', '/api/contact')
      );

      const mockRequest = {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
          turnstileToken: 'invalid-token',
        }),
      } as Request;

      const mockContext: Partial<APIContext> = {
        request: mockRequest,
        clientAddress: '192.168.1.1',
      };

      // Act
      const response = await POST(mockContext as APIContext);

      // Assert: Should return 403 with RFC 7807 Problem Details
      expect(response.status).toBe(403);
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      const body = await response.json();
      expect(body).toMatchObject({
        type: expect.stringContaining('turnstile-error'),
        title: 'Turnstile Verification Failed',
        status: 403,
        detail: expect.any(String),
      });
    });
  });

  describe('EF-037: Rate limit error (429)', () => {
    it('should return 429 with Retry-After header when rate limit exceeded', async () => {
      // Arrange: Mock processContactRequest to throw RateLimitError
      mockProcessContactRequest.mockRejectedValue(
        new RateLimitError(
          'Too many requests from this IP. Please try again later.',
          3600,
          '/api/contact'
        )
      );

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

      // Assert: Should return 429 with RFC 7807 and Retry-After header
      expect(response.status).toBe(429);
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');
      expect(response.headers.get('Retry-After')).toBe('3600');

      const body = await response.json();
      expect(body).toMatchObject({
        type: expect.stringContaining('rate-limit-error'),
        title: 'Rate Limit Exceeded',
        status: 429,
        detail: expect.any(String),
        retryAfter: 3600,
      });
    });
  });

  describe('EF-039: Email sending error (500)', () => {
    it('should return 500 with RFC 7807 format when email sending fails', async () => {
      // Arrange: Mock processContactRequest to throw EmailError
      mockProcessContactRequest.mockRejectedValue(
        new EmailError('Failed to send email. Please try again later.', '/api/contact')
      );

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

      // Assert: Should return 500 with RFC 7807 Problem Details
      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      const body = await response.json();
      expect(body).toMatchObject({
        type: expect.stringContaining('email-error'),
        title: 'Email Sending Failed',
        status: 500,
        detail: expect.any(String),
      });
    });
  });

  describe('EF-040: Internal server error (500)', () => {
    it('should return 500 with RFC 7807 format for unexpected errors', async () => {
      // Arrange: Mock processContactRequest to throw generic error
      mockProcessContactRequest.mockRejectedValue(new Error('Unexpected database error'));

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

      // Assert: Should return 500 with RFC 7807 Problem Details
      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      const body = await response.json();
      expect(body).toMatchObject({
        type: expect.stringContaining('internal-server-error'),
        title: 'Internal Server Error',
        status: 500,
        detail: 'An unexpected error occurred',
      });
    });
  });
});
