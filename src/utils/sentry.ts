import * as Sentry from '@sentry/astro';

/**
 * EF-049b: Configure Sentry projet
 *
 * Critère de Fin: Projet créé sur sentry.io, DSN configuré dans env vars
 *
 * Epic 4.2: Monitoring avec Sentry
 *
 * IMPORTANT: To complete this step:
 * 1. Create a project on sentry.io (Platform: Astro)
 * 2. Copy the DSN from project settings
 * 3. Add to .env.local: SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
 * 4. Add to Vercel env vars for production
 */

const SENTRY_DSN = import.meta.env.SENTRY_DSN || import.meta.env.PUBLIC_SENTRY_DSN;

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',

    // Sample rate for performance monitoring
    // 1.0 = 100% of transactions, 0.1 = 10%
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Capture 100% of errors in dev, 100% in prod
    sampleRate: 1.0,

    // Enable debug mode in development
    debug: !import.meta.env.PROD,

    // Ignore common errors that are not actionable
    ignoreErrors: [/^Non-Error promise rejection captured/, /^ResizeObserver loop limit exceeded/],

    // Integrations
    integrations: [Sentry.httpIntegration()],
  });
} else {
  console.warn('[Sentry] SENTRY_DSN not configured. Error tracking disabled.');
}

export { Sentry };
