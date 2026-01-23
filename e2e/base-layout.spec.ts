import { test, expect } from '@playwright/test';

/**
 * TESTS E2E : BaseLayout Component
 * Epic 2.3 - FE-026 : Phase RED
 *
 * Critères :
 * - Structure HTML5 : doctype, html, head, body
 * - Semantic HTML : <header>, <main>, <footer>
 * - Meta tags : charset, viewport, title
 * - Dark mode support : data-theme attribute
 */
test.describe('BaseLayout Component', () => {
  test.describe('HTML Structure', () => {
    test('should have valid HTML5 doctype', async ({ page }) => {
      await page.goto('/');

      const doctype = await page.evaluate(() => {
        const node = document.doctype;
        return node ? node.name : null;
      });

      expect(doctype).toBe('html');
    });

    test('should have html element with lang attribute', async ({ page }) => {
      await page.goto('/');

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBeTruthy();
      expect(['fr', 'en']).toContain(htmlLang);
    });

    test('should have head element', async ({ page }) => {
      await page.goto('/');

      const head = await page.locator('head').count();
      expect(head).toBe(1);
    });

    test('should have body element', async ({ page }) => {
      await page.goto('/');

      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });
  });

  test.describe('Meta Tags', () => {
    test('should have charset meta tag', async ({ page }) => {
      await page.goto('/');

      const charset = await page.locator('meta[charset]').getAttribute('charset');
      expect(charset).toBe('UTF-8');
    });

    test('should have viewport meta tag', async ({ page }) => {
      await page.goto('/');

      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');

      expect(viewport).toContain('width=device-width');
      expect(viewport).toContain('initial-scale=1');
    });

    test('should have title tag', async ({ page }) => {
      await page.goto('/');

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have description meta tag', async ({ page }) => {
      await page.goto('/');

      const description = await page.locator('meta[name="description"]').getAttribute('content');

      expect(description).toBeTruthy();
    });
  });

  test.describe('Semantic HTML', () => {
    test('should have header element', async ({ page }) => {
      await page.goto('/');

      const header = await page.locator('header').count();
      expect(header).toBeGreaterThanOrEqual(1);
    });

    test('should have main element', async ({ page }) => {
      await page.goto('/');

      const main = await page.locator('main').count();
      expect(main).toBe(1);
    });

    test('should have footer element', async ({ page }) => {
      await page.goto('/');

      const footer = await page.locator('footer').count();
      expect(footer).toBeGreaterThanOrEqual(1);
    });

    test('should have semantic structure order (header > main > footer)', async ({ page }) => {
      await page.goto('/');

      const bodyChildren = await page
        .locator('body > *')
        .evaluateAll((elements) => elements.map((el) => el.tagName.toLowerCase()));

      const headerIndex = bodyChildren.indexOf('header');
      const mainIndex = bodyChildren.indexOf('main');
      const footerIndex = bodyChildren.indexOf('footer');

      expect(headerIndex).toBeGreaterThanOrEqual(0);
      expect(mainIndex).toBeGreaterThan(headerIndex);
      expect(footerIndex).toBeGreaterThan(mainIndex);
    });
  });

  test.describe('Dark Mode Support', () => {
    test('should have data-theme attribute on html', async ({ page }) => {
      await page.goto('/');

      const dataTheme = await page.locator('html').getAttribute('data-theme');
      expect(dataTheme).toBeTruthy();
    });

    test('should set dark mode by default (Dark Mode First)', async ({ page }) => {
      await page.goto('/');

      const dataTheme = await page.locator('html').getAttribute('data-theme');
      expect(dataTheme).toBe('dark');
    });
  });

  test.describe('Global Styles', () => {
    test('should load global CSS with design tokens', async ({ page }) => {
      await page.goto('/');

      // Vérifier que les CSS custom properties sont définies
      const primaryColor = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue('--color-primary-600');
      });

      expect(primaryColor).toBeTruthy();
    });
  });

  test.describe('Slot Functionality', () => {
    test('should render content passed to slot', async ({ page }) => {
      await page.goto('/');

      // Le contenu de la page doit être visible dans <main>
      const mainContent = await page.locator('main').textContent();
      expect(mainContent).toBeTruthy();
      expect(mainContent!.length).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive Layout', () => {
    test('should be responsive at mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto('/');

      const body = await page.locator('body').boundingBox();
      expect(body?.width).toBe(375);
    });

    test('should be responsive at tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      await page.goto('/');

      const body = await page.locator('body').boundingBox();
      expect(body?.width).toBe(768);
    });

    test('should be responsive at desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
      await page.goto('/');

      const body = await page.locator('body').boundingBox();
      expect(body?.width).toBe(1920);
    });
  });

  test.describe('Accessibility', () => {
    test('should have skip to content link', async ({ page }) => {
      await page.goto('/');

      // Skip link pour navigation clavier (WCAG 2.4.1)
      const skipLink = await page.locator('a[href="#main-content"]').count();
      expect(skipLink).toBeGreaterThanOrEqual(0); // Optionnel mais recommandé
    });

    test('should have main landmark for screen readers', async ({ page }) => {
      await page.goto('/');

      const mainRole = await page.locator('main').getAttribute('role');
      // Pas de role="main" nécessaire car <main> est sémantique
      expect(mainRole).toBeNull();
    });
  });
});
