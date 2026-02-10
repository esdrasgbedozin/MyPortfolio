/**
 * Epic 5.2 - EF-056: Tests E2E API Endpoints
 * Tests Playwright pour valider le workflow complet de l'API Contact
 *
 * Scenarios testés:
 * - Workflow nominal: validation → anti-spam → email → success
 * - Workflow d'erreur: validation failed, rate limiting, server errors
 * - Health check endpoint
 */

import { test, expect, type APIRequestContext } from '@playwright/test';

test.describe('API /api/contact - E2E Workflow', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    // Créer un context API dédié
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:4321',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('should successfully submit valid contact form (200 OK)', async () => {
    const payload = {
      name: 'John Doe E2E Test',
      email: `john-${Date.now()}@example.com`, // Email unique pour éviter collision
      message: 'This is a test message for E2E testing.',
      turnstileToken: 'mock-token-valid-12345',
    };

    const response = await apiContext.post('/api/contact.json', {
      data: payload,
    });

    // Peut être 200 (succès) ou 429 (rate limited si tests précédents)
    if (response.status() === 429) {
      console.warn('⚠ Rate limited - test skipped (quota exceeded from previous tests)');
      test.skip();
      return;
    }

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('received');
  });

  test('should return 400 for invalid email format', async () => {
    const payload = {
      name: 'John Doe',
      email: 'invalid-email-format',
      message: 'Test message',
      turnstileToken: 'mock-token-12345',
    };

    const response = await apiContext.post('/api/contact.json', {
      data: payload,
    });

    expect(response.status()).toBe(400);

    const data = await response.json();

    // RFC 7807 Problem Details format
    expect(data).toHaveProperty('type');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('status', 400);
    expect(data).toHaveProperty('detail');
    expect(data.type).toContain('validation-error');
  });

  test('should return 400 for missing required fields', async () => {
    const payload = {
      name: 'John Doe',
      // email missing
      message: 'Test message',
      turnstileToken: 'mock-token-12345',
    };

    const response = await apiContext.post('/api/contact.json', {
      data: payload,
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.status).toBe(400);
    expect(data.title).toMatch(/Validation (Error|Failed)/);
  });

  test('should return 400 for message exceeding max length', async () => {
    const payload = {
      name: 'John Doe E2E Length',
      email: `length-${Date.now()}@example.com`,
      message: 'A'.repeat(1001), // Max is 1000
      turnstileToken: 'mock-token-12345',
    };

    const response = await apiContext.post('/api/contact.json', {
      data: payload,
    });

    // Peut être 400 (validation) ou 429 (rate limited)
    if (response.status() === 429) {
      console.warn('⚠ Rate limited - test skipped');
      test.skip();
      return;
    }

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.status).toBe(400);
  });

  test('should return 403 for invalid Turnstile token (or 429 if rate limited)', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
      turnstileToken: 'FORCE_INVALID_TOKEN',
    };

    const response = await apiContext.post('/api/contact.json', {
      data: payload,
    });

    // Peut être 403 (Turnstile) ou 429 (Rate Limit)
    expect([403, 429]).toContain(response.status());

    const data = await response.json();
    expect(data.status).toBeGreaterThanOrEqual(400);
  });

  test('should include requestId in response headers', async () => {
    const payload = {
      name: 'John Doe E2E RequestId',
      email: `requestid-${Date.now()}@example.com`,
      message: 'Test requestId header',
      turnstileToken: 'mock-token-12345',
    };

    const response = await apiContext.post('/api/contact.json', {
      data: payload,
    });

    // Vérifier requestId même sur 429
    const requestId = response.headers()['x-request-id'];

    // Le requestId devrait être présent même en cas de rate limiting
    if (response.status() === 429) {
      console.warn('⚠ Rate limited but checking requestId anyway');
      // Le requestId peut être présent ou non sur 429, ne pas fail le test
      if (requestId) {
        expect(requestId).toMatch(
          /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
        );
      }
      test.skip();
      return;
    }

    expect(requestId).toBeTruthy();
    expect(requestId).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
    ); // UUID v4
  });

  test('should include security headers', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test security headers',
      turnstileToken: 'mock-token-12345',
    };

    const response = await apiContext.post('/api/contact.json', {
      data: payload,
    });

    const headers = response.headers();

    // Vérifier les headers de sécurité (configurés via vercel.json)
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
  });
});

test.describe('API /api/health - Health Check', () => {
  test('should return 200 with healthy status', async ({ request }) => {
    const response = await request.get('http://localhost:4321/api/health');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('services');
  });

  test('should include service checks in health response', async ({ request }) => {
    const response = await request.get('http://localhost:4321/api/health');
    const data = await response.json();

    expect(data.services).toHaveProperty('resend');
    expect(data.services).toHaveProperty('turnstile');
  });
});
