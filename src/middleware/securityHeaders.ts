/**
 * EF-054: Security Headers Middleware
 *
 * Critère de Fin: Middleware applies security headers to all responses
 *
 * Epic 4.5: Security Headers
 * Phase: TDD GREEN
 *
 * Note: These headers are also configured in vercel.json for production deployment.
 * This middleware ensures headers work in local dev environment for testing.
 */

import { defineMiddleware } from 'astro:middleware';
import { applySecurityHeaders } from '../utils/applySecurityHeaders';

/**
 * Astro middleware that applies security headers to all responses
 */
export const securityHeaders = defineMiddleware(async (context, next) => {
  const response = await next();
  return applySecurityHeaders(response);
});
