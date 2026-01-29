/**
 * EF-054: Security Headers Utilities
 *
 * Pure functions for applying security headers to Response objects
 * Separated from Astro middleware for testability
 *
 * Epic 4.5: Security Headers
 * Phase: TDD GREEN
 */

/**
 * Apply security headers to a Response object
 *
 * Headers Applied:
 * - X-Frame-Options: DENY (prevent clickjacking)
 * - X-Content-Type-Options: nosniff (prevent MIME sniffing)
 * - X-XSS-Protection: 1; mode=block (XSS protection for old browsers)
 * - Content-Security-Policy: Strict CSP with Turnstile & Plausible
 * - Strict-Transport-Security: HSTS with 1 year max-age
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Permissions-Policy: Disable camera, microphone, geolocation
 *
 * @param response - Response object to add headers to
 * @returns Response with security headers applied
 */
export function applySecurityHeaders(response: Response): Response {
  // Apply security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy - Allow Cloudflare Turnstile & Plausible Analytics
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://plausible.io",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://challenges.cloudflare.com https://plausible.io",
      'frame-src https://challenges.cloudflare.com',
    ].join('; ')
  );

  // Strict Transport Security - Force HTTPS for 1 year
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}
