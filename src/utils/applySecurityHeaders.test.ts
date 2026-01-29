/**
 * EF-055: TEST - Security Headers Middleware
 *
 * Critère de Fin: Test verifies middleware applies security headers (RED → GREEN)
 *
 * Epic 4.5: Security Headers
 * Phase: TDD GREEN
 *
 * Tests that the securityHeaders middleware applies all required security headers:
 * - X-Frame-Options: DENY
 * - X-Content-Type-Options: nosniff
 * - X-XSS-Protection: 1; mode=block
 * - Content-Security-Policy: ...
 * - Strict-Transport-Security: max-age=31536000; includeSubDomains
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Permissions-Policy: camera=(), microphone=(), geolocation=()
 */

import { describe, it, expect } from 'vitest';
import { applySecurityHeaders } from './applySecurityHeaders';

describe('Security Headers Utility - Epic 4.5', () => {
  it('should apply X-Frame-Options: DENY header', () => {
    // ARRANGE
    const mockResponse = new Response('OK', { status: 200 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    expect(result.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('should apply X-Content-Type-Options: nosniff header', () => {
    // ARRANGE
    const mockResponse = new Response('OK', { status: 200 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    expect(result.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('should apply X-XSS-Protection: 1; mode=block header', () => {
    // ARRANGE
    const mockResponse = new Response('OK', { status: 200 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    expect(result.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });

  it('should apply Referrer-Policy: strict-origin-when-cross-origin header', () => {
    // ARRANGE
    const mockResponse = new Response('OK', { status: 200 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    expect(result.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('should apply Permissions-Policy header to disable camera, microphone, geolocation', () => {
    // ARRANGE
    const mockResponse = new Response('OK', { status: 200 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    const policy = result.headers.get('Permissions-Policy');
    expect(policy).toContain('camera=()');
    expect(policy).toContain('microphone=()');
    expect(policy).toContain('geolocation=()');
  });

  it('should apply Content-Security-Policy with strict rules', () => {
    // ARRANGE
    const mockResponse = new Response('OK', { status: 200 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    const csp = result.headers.get('Content-Security-Policy');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('https://challenges.cloudflare.com');
    expect(csp).toContain('https://plausible.io');
  });

  it('should apply Strict-Transport-Security with 1 year max-age', () => {
    // ARRANGE
    const mockResponse = new Response('OK', { status: 200 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    const hsts = result.headers.get('Strict-Transport-Security');
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
  });

  it('should preserve original response body and status', async () => {
    // ARRANGE
    const mockResponse = new Response('Test Body', { status: 404 });

    // ACT
    const result = applySecurityHeaders(mockResponse);

    // ASSERT
    expect(result.status).toBe(404);
    expect(await result.text()).toBe('Test Body');
  });
});
