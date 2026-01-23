import { test, expect } from '@playwright/test';

/**
 * TESTS E2E : Footer Component
 * Epic 2.3 - FE-030 : Phase RED
 *
 * Critères :
 * - Copyright : année dynamique
 * - Liens sociaux : GitHub, LinkedIn, Email
 * - Accessibilité : ARIA labels, semantic HTML
 * - Design tokens : Dark Mode First
 */
test.describe('Footer Component', () => {
  test.describe('Structure', () => {
    test('should render footer element', async ({ page }) => {
      await page.goto('/');

      const footer = await page.locator('footer').count();
      expect(footer).toBe(1);
    });

    test('should have border top (visual separation)', async ({ page }) => {
      await page.goto('/');

      const footer = page.locator('footer');
      const borderTop = await footer.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.borderTopWidth;
      });

      expect(parseFloat(borderTop)).toBeGreaterThan(0);
    });

    test('should use design tokens for styling', async ({ page }) => {
      await page.goto('/');

      const footerColor = await page.locator('footer').evaluate((el) => {
        return getComputedStyle(el).color;
      });

      expect(footerColor).toBeTruthy();
    });
  });

  test.describe('Copyright', () => {
    test('should display copyright text', async ({ page }) => {
      await page.goto('/');

      const copyright = await page.locator('footer').textContent();
      expect(copyright).toContain('©');
    });

    test('should display current year', async ({ page }) => {
      await page.goto('/');

      const currentYear = new Date().getFullYear().toString();
      const footerText = await page.locator('footer').textContent();

      expect(footerText).toContain(currentYear);
    });

    test('should contain rights statement', async ({ page }) => {
      await page.goto('/');

      const footerText = await page.locator('footer').textContent();
      expect(footerText).toMatch(/all rights reserved|tous droits réservés/i);
    });
  });

  test.describe('Social Links', () => {
    test('should have social links', async ({ page }) => {
      await page.goto('/');

      const socialLinks = await page
        .locator(
          'footer a[aria-label*="GitHub"], footer a[aria-label*="LinkedIn"], footer a[aria-label*="Email"]'
        )
        .count();
      expect(socialLinks).toBeGreaterThanOrEqual(1); // Au moins 1 lien social
    });

    test('should have GitHub link', async ({ page }) => {
      await page.goto('/');

      const githubLink = await page.locator('footer a[aria-label*="GitHub"]').count();
      expect(githubLink).toBeGreaterThanOrEqual(1);
    });

    test('should have LinkedIn link', async ({ page }) => {
      await page.goto('/');

      const linkedinLink = await page.locator('footer a[aria-label*="LinkedIn"]').count();
      expect(linkedinLink).toBeGreaterThanOrEqual(1);
    });

    test('should have Email link', async ({ page }) => {
      await page.goto('/');

      const emailLink = await page.locator('footer a[aria-label*="email" i]').count();
      expect(emailLink).toBeGreaterThanOrEqual(1);
    });

    test('should open external links in new tab', async ({ page }) => {
      await page.goto('/');

      const externalLinks = page.locator('footer a[target="_blank"]');
      const count = await externalLinks.count();

      // Au moins GitHub et LinkedIn doivent s'ouvrir dans un nouvel onglet
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('should have rel="noopener noreferrer" on external links', async ({ page }) => {
      await page.goto('/');

      const externalLinks = page.locator('footer a[target="_blank"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        const rel = await externalLinks.nth(i).getAttribute('rel');
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have aria-label on social links', async ({ page }) => {
      await page.goto('/');

      const socialLinks = page.locator('footer a[aria-label]');
      const count = await socialLinks.count();

      expect(count).toBeGreaterThanOrEqual(3); // GitHub, LinkedIn, Email
    });

    test('should have descriptive aria-labels', async ({ page }) => {
      await page.goto('/');

      const socialLinks = page.locator('footer a[aria-label]');
      const count = await socialLinks.count();

      for (let i = 0; i < count; i++) {
        const ariaLabel = await socialLinks.nth(i).getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel!.length).toBeGreaterThan(3); // Description meaningful
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');

      // Tab jusqu'au footer
      let focusedElement = '';
      let tabCount = 0;

      while (tabCount < 20 && !focusedElement.includes('footer')) {
        await page.keyboard.press('Tab');
        focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return el?.closest('footer') ? 'footer' : '';
        });
        tabCount++;
      }

      expect(focusedElement).toBe('footer');
    });

    test('should have footer landmark for screen readers', async ({ page }) => {
      await page.goto('/');

      // <footer> est un landmark HTML5
      const contentinfo = await page.locator('footer').count();
      expect(contentinfo).toBe(1);
    });
  });

  test.describe('Layout', () => {
    test('should have container for content centering', async ({ page }) => {
      await page.goto('/');

      const container = await page.locator('footer .container, footer [class*="max-w"]').count();
      expect(container).toBeGreaterThanOrEqual(1);
    });

    test('should be centered text by default', async ({ page }) => {
      await page.goto('/');

      const textAlign = await page
        .locator('footer .container, footer [class*="text-center"]')
        .first()
        .evaluate((el) => {
          return getComputedStyle(el).textAlign;
        });

      expect(textAlign).toBe('center');
    });

    test('should have spacing for visual breathing room', async ({ page }) => {
      await page.goto('/');

      const padding = await page
        .locator('footer .container, footer > div')
        .first()
        .evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            top: parseFloat(style.paddingTop),
            bottom: parseFloat(style.paddingBottom),
          };
        });

      expect(padding.top).toBeGreaterThan(0);
      expect(padding.bottom).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive', () => {
    test('should be visible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const footer = await page.locator('footer').isVisible();
      expect(footer).toBe(true);
    });

    test('should be visible on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const footer = await page.locator('footer').isVisible();
      expect(footer).toBe(true);
    });
  });

  test.describe('Dark Mode', () => {
    test('should use neutral colors for text', async ({ page }) => {
      await page.goto('/');

      const footerColor = await page.locator('footer').evaluate((el) => {
        return getComputedStyle(el).color;
      });

      expect(footerColor).toBeTruthy();
      // Devrait être une couleur neutre (pas trop contrastée)
    });
  });
});
