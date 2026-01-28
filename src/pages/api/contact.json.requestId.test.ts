/**
 * Tests pour la corrélation requestId dans les logs
 * Epic 3.3 - EF-044
 *
 * Valide que le requestId est propagé dans tous les logs d'une requête
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { APIContext } from 'astro';
import { POST } from './contact.json';
import { logger } from '../../utils/logger';

// Mock ContactService
const mockProcessContactRequest = vi.fn();
vi.mock('../../services/ContactService', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ContactService: vi.fn(function (this: any) {
      this.processContactRequest = mockProcessContactRequest;
    }),
  };
});

// Mock logger to capture calls
vi.mock('../../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('POST /api/contact.json - Epic 3.3 EF-044 RequestId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate and use requestId in all log calls', async () => {
    // Arrange
    mockProcessContactRequest.mockResolvedValue(undefined);

    const mockContext = {
      request: {
        json: vi.fn().mockResolvedValue({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          turnstileToken: 'test-token',
        }),
      },
      clientAddress: '127.0.0.1',
    } as unknown as APIContext;

    // Act
    await POST(mockContext);

    // Assert: Logger should be called 2 times (request received + success)
    expect(logger.info).toHaveBeenCalledTimes(2);

    // Extract requestId from first log call
    const firstLogCall = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0];
    const firstMetadata = firstLogCall[1];
    const requestId = firstMetadata?.requestId;

    expect(requestId).toBeDefined();
    expect(typeof requestId).toBe('string');
    expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i); // UUID format

    // Verify requestId is propagated to all log calls
    const secondLogCall = (logger.info as ReturnType<typeof vi.fn>).mock.calls[1];
    const secondMetadata = secondLogCall[1];

    expect(secondMetadata?.requestId).toBe(requestId); // Same requestId
  });

  it('should use same requestId in error logs', async () => {
    // Arrange
    const testError = new Error('Test error');
    mockProcessContactRequest.mockRejectedValue(testError);

    const mockContext = {
      request: {
        json: vi.fn().mockResolvedValue({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          turnstileToken: 'test-token',
        }),
        method: 'POST',
        url: 'http://localhost:4321/api/contact.json',
        headers: new Headers({
          'User-Agent': 'test-agent',
        }),
      },
      clientAddress: '127.0.0.1',
    } as unknown as APIContext;

    // Act
    await POST(mockContext);

    // Assert: Logger should have called info (request received) + error
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);

    // Extract requestId from info log
    const infoCall = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0];
    const infoMetadata = infoCall[1];
    const requestId = infoMetadata?.requestId;

    // Verify requestId is in error log
    const errorCall = (logger.error as ReturnType<typeof vi.fn>).mock.calls[0];
    const errorMetadata = errorCall[2]; // error() has signature (message, error, metadata)

    expect(errorMetadata?.requestId).toBe(requestId); // Same requestId
  });

  it('should log request with context and clientIp', async () => {
    // Arrange
    mockProcessContactRequest.mockResolvedValue(undefined);

    const mockContext = {
      request: {
        json: vi.fn().mockResolvedValue({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          turnstileToken: 'test-token',
        }),
      },
      clientAddress: '192.168.1.100',
    } as unknown as APIContext;

    // Act
    await POST(mockContext);

    // Assert: First log should contain context and clientIp
    const firstLogCall = (logger.info as ReturnType<typeof vi.fn>).mock.calls[0];
    const metadata = firstLogCall[1];

    expect(metadata?.context).toBe('api/contact');
    expect(metadata?.clientIp).toBe('192.168.1.100');
    expect(metadata?.hasName).toBe(true);
    expect(metadata?.hasEmail).toBe(true);
  });
});
