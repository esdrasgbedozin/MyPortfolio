/**
 * Sitemap XML Generator - Epic 7.3 FE-095
 *
 * Génère sitemap.xml multilingue pour FR/EN
 * Respecte le format XML standard avec hreflang
 * Inclut les pages statiques ET les pages de détail des projets
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Site URL sourced from astro.config.mjs `site` property.
 * Update astro.config.mjs when deploying to production domain.
 */
const SITE_URL = import.meta.env.SITE || 'https://esdrasgbedozin.dev';

// Symmetric paths (same slug for both locales)
const PATHS = [
  { path: '/projects', priority: '0.8' },
  { path: '/skills', priority: '0.8' },
  { path: '/contact', priority: '0.8' },
  { path: '/certifications', priority: '0.8' },
  { path: '', priority: '1.0' },
];

function buildEntry(frUrl: string, enUrl: string, priority: string = '0.8'): string {
  return `
  <url>
    <loc>${frUrl}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const entries: string[] = [];

  // Static pages (FR/EN pairs — symmetric routes)
  PATHS.forEach(({ path, priority }) => {
    const frUrl = `${SITE_URL}/fr${path}`;
    const enUrl = `${SITE_URL}/en${path}`;
    entries.push(buildEntry(frUrl, enUrl, priority));
  });

  // Project detail pages (dynamic slugs from content collection)
  try {
    const allProjects = await getCollection('projects');
    // Group by slug (strip locale suffix): "api-ecommerce.fr" → "api-ecommerce"
    const slugs = new Set<string>();
    for (const project of allProjects) {
      // Content file IDs are like "api-ecommerce.fr" or "api-ecommerce.en"
      const slug = project.id.replace(/\.(fr|en)$/, '');
      slugs.add(slug);
    }

    for (const slug of slugs) {
      const frUrl = `${SITE_URL}/fr/projects/${slug}`;
      const enUrl = `${SITE_URL}/en/projects/${slug}`;
      entries.push(buildEntry(frUrl, enUrl, '0.6'));
    }
  } catch {
    // Content collection may not be available during build - skip dynamic entries
  }

  // Build XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
