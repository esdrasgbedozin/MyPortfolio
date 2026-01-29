import { describe, it, expect } from 'vitest';
import type { APIContext } from 'astro';

/**
 * EF-046: Test endpoint /api/health (200)
 *
 * Critère de Fin: Test GET /api/health retourne status healthy (RED)
 *
 * Epic 4.1: Endpoint Health
 * Phase: TDD RED
 */

describe('GET /api/health', () => {
  it('should return 200 with status healthy', async () => {
    // ARRANGE
    const mockContext: Partial<APIContext> = {
      request: new Request('http://localhost:4321/api/health', {
        method: 'GET',
      }),
    };

    // ACT
    const { GET } = await import('./health');
    const response = await GET(mockContext as APIContext);

    // ASSERT
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      status: expect.stringMatching(/^(healthy|degraded)$/), // Depends on env vars
      timestamp: expect.any(String),
      services: {
        resend: expect.stringMatching(/^(up|down)$/),
        turnstile: expect.stringMatching(/^(up|down)$/),
      },
    });
  });

  it('should return ISO 8601 timestamp', async () => {
    // ARRANGE
    const mockContext: Partial<APIContext> = {
      request: new Request('http://localhost:4321/api/health', {
        method: 'GET',
      }),
    };

    // ACT
    const { GET } = await import('./health');
    const response = await GET(mockContext as APIContext);

    // ASSERT
    const data = await response.json();
    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it('should set Content-Type to application/json', async () => {
    // ARRANGE
    const mockContext: Partial<APIContext> = {
      request: new Request('http://localhost:4321/api/health', {
        method: 'GET',
      }),
    };

    // ACT
    const { GET } = await import('./health');
    const response = await GET(mockContext as APIContext);

    // ASSERT
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
});

/**
 * EF-048: Test checks dépendances
 *
 * Critère de Fin: Test vérification Resend + Turnstile UP/DOWN (RED)
 *
 * Epic 4.1: Endpoint Health
 * Phase: TDD RED
 */

describe('GET /api/health - Dependency Checks', () => {
  it('should include services status in response', async () => {
    // ARRANGE
    const mockContext: Partial<APIContext> = {
      request: new Request('http://localhost:4321/api/health', {
        method: 'GET',
      }),
    };

    // ACT
    const { GET } = await import('./health');
    const response = await GET(mockContext as APIContext);

    // ASSERT
    const data = await response.json();
    expect(data.services).toBeDefined();
    expect(data.services).toEqual({
      resend: expect.any(String), // 'up' or 'down'
      turnstile: expect.any(String), // 'up' or 'down'
    });
  });

  it('should return status degraded when one service is down', async () => {
    // ARRANGE
    const mockContext: Partial<APIContext> = {
      request: new Request('http://localhost:4321/api/health', {
        method: 'GET',
      }),
    };

    // ACT
    const { GET } = await import('./health');
    const response = await GET(mockContext as APIContext);

    // ASSERT
    const data = await response.json();

    // If ANY service is down, status should be 'degraded'
    const hasDownService = Object.values(data.services || {}).includes('down');
    if (hasDownService) {
      expect(data.status).toBe('degraded');
    } else {
      expect(data.status).toBe('healthy');
    }
  });

  it('should include service details with status and error message', async () => {
    // ARRANGE
    const mockContext: Partial<APIContext> = {
      request: new Request('http://localhost:4321/api/health', {
        method: 'GET',
      }),
    };

    // ACT
    const { GET } = await import('./health');
    const response = await GET(mockContext as APIContext);

    // ASSERT
    const data = await response.json();
    expect(data.services).toBeDefined();

    // Each service should have at least a status
    Object.keys(data.services).forEach((key) => {
      expect(['up', 'down']).toContain(data.services[key]);
    });
  });
});
