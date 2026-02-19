// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: vercel({
    // edgeMiddleware disabled: the generated edge fetch() does not forward
    // HTTP method/body to the Node.js render function, breaking POST endpoints.
    // Security headers middleware runs in the Node.js serverless function instead.
  }),

  site: 'https://esdrasgbedozin.dev', // FE-094/095: Base URL for canonical/sitemap

  // i18n Configuration (FE-032)
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [react(), mdx()],

  // Performance: CSS inlining (FE-106/107)
  build: {
    inlineStylesheets: 'auto', // Inline stylesheets <4KB, link larger ones
  },

  // Compression & Prefetch (FE-110)
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport', // Prefetch links when they enter viewport
  },

  vite: {
    plugins: [
      tailwindcss(),
      // Bundle analyzer (FE-108) - run with: ANALYZE=true pnpm build
      ...(process.env.ANALYZE
        ? [
            /** @type {any} */ (
              visualizer({
                open: true,
                filename: 'bundle-stats.html',
                gzipSize: true,
                brotliSize: true,
              })
            ),
          ]
        : []),
    ],
    build: {
      // Code splitting & minification (FE-109/110)
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-particles': ['@tsparticles/react', '@tsparticles/engine', '@tsparticles/slim'],
          },
        },
      },
    },
  },
});
