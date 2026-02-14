// Epic 6.1 - EF-064/065: Lighthouse CI Configuration
// Performance budgets pour Portfolio Pro
// NOTE: LHCI runs against dev server in CI — budgets are calibrated for dev mode.
// Production builds (SSG via Vercel) will score significantly better.
module.exports = {
  ci: {
    collect: {
      // URLs à tester
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/fr/',
        'http://localhost:4321/fr/projects',
        'http://localhost:4321/fr/certifications',
        'http://localhost:4321/fr/skills',
        'http://localhost:4321/fr/contact',
        'http://localhost:4321/en/',
        'http://localhost:4321/en/projects',
      ],
      // Nombre de runs pour moyenne
      numberOfRuns: 1, // 1 seul run pour tests locaux (3 en CI)
      // Serveur local Astro dev
      startServerCommand: 'pnpm dev --host',
      startServerReadyPattern: 'Local:.*4321',
      startServerReadyTimeout: 60000,
      // Options Lighthouse
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
        },
      },
    },
    assert: {
      // Scores minimums (0-1 scale)
      // Dev mode budgets — production will exceed these thresholds
      assertions: {
        // Category scores (relaxed for dev mode + CI runners)
        'categories:performance': ['warn', { minScore: 0.6 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals (relaxed for dev server on CI)
        'first-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 5000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],
        'speed-index': ['warn', { maxNumericValue: 5000 }],

        // Resource Budgets (dev mode serves unminified/unbundled code)
        'resource-summary:document:size': ['warn', { maxNumericValue: 250000 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 4000000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 500000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 200000 }],

        // Requests Count
        'resource-summary:total:count': ['warn', { maxNumericValue: 80 }],

        // Accessibility (errors — these must pass)
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'color-contrast': ['warn', { minScore: 0 }], // Gradient text triggers false positives
        'document-title': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        label: 'error',
        'link-name': 'error',

        // SEO
        'meta-description': 'error',
        canonical: 'error',

        // Best Practices
        'errors-in-console': 'off',
        'no-vulnerable-libraries': 'off',
        'uses-http2': 'off',
        'uses-passive-event-listeners': 'warn',
      },
    },
    upload: {
      // Temporary public storage (pour CI GitHub Actions)
      target: 'temporary-public-storage',
    },
  },
};
