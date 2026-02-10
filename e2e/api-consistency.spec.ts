/**
 * Epic 5.2 - EF-057: Validation Mock vs API Réelle
 * Compare le comportement du Mock Server (Prism) avec l'API réelle (Edge Functions)
 *
 * Objectif: S'assurer que le mock et l'API réelle sont cohérents
 * Prévient les régressions lors du switch Mock → API réelle
 *
 * NOTE: Ces tests nécessitent un mock server running sur localhost:4010
 * Pour activer: pnpm run mock:api (si disponible)
 */

import { test, expect } from '@playwright/test';

const MOCK_BASE_URL = 'http://localhost:4010';
const API_BASE_URL = 'http://localhost:4321';

/**
 * Vérifie si le mock server est disponible
 */
async function isMockServerAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${MOCK_BASE_URL}/api/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Test helper to compare responses from Mock and Real API
 */
async function compareResponses(
  endpoint: string,
  options: RequestInit,
  testName: string
): Promise<void> {
  // Vérifier si le mock server est disponible
  const mockAvailable = await isMockServerAvailable();

  if (!mockAvailable) {
    console.warn('⚠ Mock server not available on localhost:4010 - skipping consistency test');
    test.skip();
    return;
  }

  // Call Mock Server
  const mockResponse = await fetch(`${MOCK_BASE_URL}${endpoint}`, options);
  const mockData = await mockResponse.json().catch(() => null);

  // Call Real API
  const apiResponse = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const apiData = await apiResponse.json().catch(() => null);

  // Compare status codes
  expect(apiResponse.status, `${testName}: Status codes should match`).toBe(mockResponse.status);

  // Compare response structure (not exact values, but shape)
  if (mockData && apiData) {
    const mockKeys = Object.keys(mockData).sort();
    const apiKeys = Object.keys(apiData).sort();

    expect(apiKeys, `${testName}: Response keys should match between mock and API`).toEqual(
      mockKeys
    );
  }
}

test.describe('Mock vs API Consistency - GET /api/health', () => {
  test('should return same structure for health check', async () => {
    await compareResponses('/api/health', { method: 'GET' }, 'GET /api/health');
  });
});

test.describe('Mock vs API Consistency - POST /api/contact', () => {
  const validPayload = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Test message for consistency check',
    turnstileToken: 'mock-token-12345',
  };

  const invalidEmailPayload = {
    name: 'John Doe',
    email: 'invalid-email',
    message: 'Test message',
    turnstileToken: 'mock-token-12345',
  };

  test('should return same 200 response structure for valid payload', async () => {
    await compareResponses(
      '/api/contact',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      },
      'POST /api/contact (valid)'
    );
  });

  test('should return same 400 error structure for invalid email', async () => {
    await compareResponses(
      '/api/contact',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidEmailPayload),
      },
      'POST /api/contact (invalid email)'
    );
  });

  test('should return RFC 7807 format for validation errors (both)', async () => {
    // Vérifier si le mock server est disponible
    const mockAvailable = await isMockServerAvailable();

    if (!mockAvailable) {
      console.warn('⚠ Mock server not available - skipping test');
      test.skip();
      return;
    }

    // Test Mock
    const mockResponse = await fetch(`${MOCK_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidEmailPayload),
    });
    const mockData = await mockResponse.json();

    // Test Real API
    const apiResponse = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidEmailPayload),
    });
    const apiData = await apiResponse.json();

    // Both should follow RFC 7807
    const rfc7807Fields = ['type', 'title', 'status', 'detail'];

    for (const field of rfc7807Fields) {
      expect(mockData, `Mock should have RFC 7807 field: ${field}`).toHaveProperty(field);
      expect(apiData, `API should have RFC 7807 field: ${field}`).toHaveProperty(field);
    }
  });
});

test.describe('Mock vs API Consistency - Error Codes', () => {
  test('should return 400 for missing required field (both)', async () => {
    // Vérifier si le mock server est disponible
    const mockAvailable = await isMockServerAvailable();

    if (!mockAvailable) {
      console.warn('⚠ Mock server not available - skipping test');
      test.skip();
      return;
    }

    const incompletePayload = {
      name: 'John Doe',
      // email missing
      message: 'Test',
      turnstileToken: 'mock-token',
    };

    const mockResponse = await fetch(`${MOCK_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompletePayload),
    });

    const apiResponse = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompletePayload),
    });

    expect(mockResponse.status).toBe(400);
    expect(apiResponse.status).toBe(400);
  });
});
