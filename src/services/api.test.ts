/**
 * FE-077: TEST - API Client Service
 *
 * Critère de Fin: Test fetch /api/health retourne 200 (RED → GREEN)
 *
 * Epic 6.1: Configuration API Client
 * Phase: TDD RED
 *
 * Tests:
 * - GET request success
 * - POST request success
 * - Error handling (4xx, 5xx)
 * - Timeout handling
 * - Custom headers
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApiClient, ApiError } from './api';

describe('API Client - Epic 6.1 FE-077', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock global fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should perform GET request successfully', async () => {
    // ARRANGE
    const mockData = { status: 'healthy', timestamp: '2026-01-29T19:00:00Z' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const api = createApiClient('http://localhost:4010/api');

    // ACT
    const result = await api.get('/health');

    // ASSERT
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4010/api/health',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it('should perform POST request with data', async () => {
    // ARRANGE
    const mockRequestData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello',
    };
    const mockResponseData = { success: true, id: '123' };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponseData,
    });

    const api = createApiClient('http://localhost:4010/api');

    // ACT
    const result = await api.post('/contact', mockRequestData);

    // ASSERT
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4010/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockRequestData),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual(mockResponseData);
  });

  it('should throw ApiError on 4xx response', async () => {
    // ARRANGE
    const errorData = { message: 'Invalid request', errors: ['Email required'] };
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: vi.fn().mockResolvedValue(errorData),
    });

    const api = createApiClient('http://localhost:4010/api');

    // ACT & ASSERT
    try {
      await api.post('/contact', {});
      expect.fail('Should have thrown ApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
        expect(error.message).toBe('Invalid request');
      }
    }
  });

  it('should throw ApiError on 5xx response', async () => {
    // ARRANGE
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockResolvedValue({ message: 'Server error' }),
    });

    const api = createApiClient('http://localhost:4010/api');

    // ACT & ASSERT
    try {
      await api.get('/health');
      expect.fail('Should have thrown ApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    }
  });

  it('should handle timeout', async () => {
    // ARRANGE - Simuler un abort du controller
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    fetchMock.mockRejectedValueOnce(abortError);

    const api = createApiClient('http://localhost:4010/api');

    // ACT & ASSERT
    try {
      await api.get('/health', { timeout: 100 });
      expect.fail('Should have thrown ApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.status).toBe(408);
        expect(error.statusText).toBe('Request Timeout');
      }
    }
  });

  it('should include custom headers', async () => {
    // ARRANGE
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const api = createApiClient('http://localhost:4010/api');

    // ACT
    await api.get('/health', {
      headers: {
        Authorization: 'Bearer token123',
      },
    });

    // ASSERT
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4010/api/health',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
        }),
      })
    );
  });

  it('should use default baseUrl from env if not provided', async () => {
    // ARRANGE
    const originalEnv = import.meta.env.PUBLIC_API_URL;
    import.meta.env.PUBLIC_API_URL = 'http://test-api.local/api';

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const api = createApiClient();

    // ACT
    await api.get('/health');

    // ASSERT
    expect(fetchMock).toHaveBeenCalledWith('http://test-api.local/api/health', expect.any(Object));

    // Cleanup
    import.meta.env.PUBLIC_API_URL = originalEnv;
  });

  it('should perform PUT request', async () => {
    // ARRANGE
    const mockData = { id: '123', name: 'Updated' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const api = createApiClient('http://localhost:4010/api');

    // ACT
    const result = await api.put('/projects/123', { name: 'Updated' });

    // ASSERT
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4010/api/projects/123',
      expect.objectContaining({
        method: 'PUT',
      })
    );
    expect(result).toEqual(mockData);
  });

  it('should perform DELETE request', async () => {
    // ARRANGE
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    const api = createApiClient('http://localhost:4010/api');

    // ACT
    const result = await api.delete('/projects/123');

    // ASSERT
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4010/api/projects/123',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(result).toEqual({ success: true });
  });
});
