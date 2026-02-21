// Epic 6.1 - EF-064/065: Lighthouse CI Configuration
// Performance budgets pour Portfolio Pro
// Runs against pre-rendered static output via `serve` package.
// The @astrojs/vercel adapter does not support `astro preview`,
// so we serve .vercel/output/static/ directly.
module.exports = {
  ci: {
    collect: {
      // URLs à tester (all pre-rendered pages)
      // Note: Root / is a server-side redirect (not pre-rendered), excluded.
      url: [
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
      // Serve pre-rendered static output (Vercel adapter build)
      startServerCommand: 'npx serve .vercel/output/static -l 4321',
      startServerReadyPattern: 'Accepting connections|Local',
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
      // Production build budgets
      assertions: {
        // Category scores
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 400 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],

        // Resource Budgets (production build — smaller bundles)
        'resource-summary:document:size': ['warn', { maxNumericValue: 150000 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 2000000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 80000 }],
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
