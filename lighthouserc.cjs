// Epic 6.1 - EF-064/065: Lighthouse CI Configuration
// Performance budgets pour Portfolio Pro
module.exports = {
  ci: {
    collect: {
      // URLs à tester
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/fr/',
        'http://localhost:4321/fr/projets',
        'http://localhost:4321/fr/certifications',
        'http://localhost:4321/fr/competences',
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
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // <2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // <2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // <0.1
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // <300ms
        'speed-index': ['error', { maxNumericValue: 3000 }], // <3s

        // Resource Budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }], // <50KB HTML
        'resource-summary:script:size': ['error', { maxNumericValue: 150000 }], // <150KB JS
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 30000 }], // <30KB CSS
        'resource-summary:image:size': ['error', { maxNumericValue: 500000 }], // <500KB images total
        'resource-summary:font:size': ['error', { maxNumericValue: 100000 }], // <100KB fonts

        // Requests Count
        'resource-summary:total:count': ['warn', { maxNumericValue: 50 }], // <50 requests

        // Accessibility
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        label: 'error',
        'link-name': 'error',

        // SEO
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        canonical: 'error',

        // Best Practices
        'errors-in-console': 'off', // Désactivé car warnings normaux
        'no-vulnerable-libraries': 'warn',
        'uses-http2': 'warn',
        'uses-passive-event-listeners': 'warn',
      },
    },
    upload: {
      // Temporary public storage (pour CI GitHub Actions)
      target: 'temporary-public-storage',
    },
  },
};
