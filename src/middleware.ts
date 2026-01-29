/**
 * Astro Middleware Chain
 *
 * Executes middlewares in sequence for all requests
 * Order matters: security headers should be applied first
 */

import { sequence } from 'astro:middleware';
import { securityHeaders } from './middleware/securityHeaders';

// Chain middlewares in order
export const onRequest = sequence(
  securityHeaders
  // Add more middlewares here as needed
);
