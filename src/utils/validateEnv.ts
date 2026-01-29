/**
 * EF-053: Valider env vars au startup
 *
 * Critère de Fin: Fonction validateEnv() avec Zod (GREEN)
 *
 * Epic 4.4: Variables d'Environnement
 * Phase: TDD GREEN
 *
 * Usage:
 * Call validateEnv() at application startup (in astro.config.ts or entry point)
 * Will throw descriptive errors if required env vars are missing or invalid
 */

import { z } from 'zod';

/**
 * Zod schema for environment variables validation
 *
 * Required vars:
 * - RESEND_API_KEY: Must start with "re_"
 * - TURNSTILE_SECRET_KEY: Must start with "0x"
 *
 * Optional vars:
 * - SENTRY_DSN: Must be valid URL if present
 * - PUBLIC_SENTRY_DSN: Alternative public DSN
 */
const envSchema = z.object({
  // Required: Email service
  RESEND_API_KEY: z
    .string()
    .min(1, 'RESEND_API_KEY is required')
    .refine((val) => val.startsWith('re_'), {
      message: 'RESEND_API_KEY must start with "re_"',
    }),

  // Required: Anti-spam service
  TURNSTILE_SECRET_KEY: z
    .string()
    .min(1, 'TURNSTILE_SECRET_KEY is required')
    .refine((val) => val.startsWith('0x'), {
      message: 'TURNSTILE_SECRET_KEY must start with "0x"',
    }),

  // Optional: Error tracking (can use SENTRY_DSN or PUBLIC_SENTRY_DSN)
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),

  PUBLIC_SENTRY_DSN: z.string().url('PUBLIC_SENTRY_DSN must be a valid URL').optional(),
});

/**
 * Validate environment variables at startup
 *
 * @param env - Optional environment object to validate (defaults to import.meta.env)
 * @throws {Error} if required env vars are missing or invalid
 *
 * @example
 * ```typescript
 * // In astro.config.ts or app entry point
 * import { validateEnv } from './utils/validateEnv';
 *
 * validateEnv(); // Throws if invalid
 * ```
 */
export function validateEnv(env?: Record<string, unknown>): void {
  // Use provided env or default to import.meta.env
  const envToValidate = env || {
    RESEND_API_KEY: import.meta.env.RESEND_API_KEY,
    TURNSTILE_SECRET_KEY: import.meta.env.TURNSTILE_SECRET_KEY,
    SENTRY_DSN: import.meta.env.SENTRY_DSN,
    PUBLIC_SENTRY_DSN: import.meta.env.PUBLIC_SENTRY_DSN,
  };

  const result = envSchema.safeParse(envToValidate);

  if (!result.success) {
    // Zod 4.x uses 'issues' instead of 'errors'
    const messages = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    throw new Error(`Environment validation failed:\n${messages.join('\n')}`);
  }
}
