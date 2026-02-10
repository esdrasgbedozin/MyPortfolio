/**
 * Sitemap XML Generator - Epic 7.3 FE-095
 *
 * Génère sitemap.xml multilingue pour FR/EN
 * Respecte le format XML standard avec hreflang
 */

import type { APIRoute } from 'astro';

/**
 * Site URL sourced from astro.config.mjs `site` property.
 * Update astro.config.mjs when deploying to production domain.
 */
const SITE_URL = import.meta.env.SITE || 'https://portfolio.example.com';

// Map FR paths to EN paths
const PATH_MAP: Record<string, string> = {
  '/projets': '/projects',
  '/competences': '/skills',
  '/contact': '/contact',
  '/certifications': '/certifications',
  '': '',
};

export const GET: APIRoute = async () => {
  // Build sitemap entries
  const entries: string[] = [];

  // For each FR route, create entry with hreflang alternates
  Object.entries(PATH_MAP).forEach(([frPath, enPath]) => {
    const frUrl = `${SITE_URL}/fr${frPath}`;
    const enUrl = `${SITE_URL}/en${enPath}`;

    // Add entry for FR page
    entries.push(`
  <url>
    <loc>${frUrl}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);

    // Add entry for EN page
    entries.push(`
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

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
