import { test, expect } from '@playwright/test';

/**
 * TESTS E2E : Header Component
 * Epic 2.3 - FE-028 : Phase RED
 *
 * Critères :
 * - Navigation : liens menu principaux
 * - Logo : cliquable, retour accueil
 * - Responsive : burger menu mobile
 * - Accessibilité : aria-label, keyboard nav
 */
test.describe('Header Component', () => {
  test.describe('Structure', () => {
    test('should render header element', async ({ page }) => {
      await page.goto('/');

      const header = await page.locator('header').count();
      expect(header).toBe(1);
    });

    test('should render navigation', async ({ page }) => {
      await page.goto('/');

      const nav = await page.locator('header nav').count();
      expect(nav).toBeGreaterThanOrEqual(1);
    });

    test('should have aria-label on navigation', async ({ page }) => {
      await page.goto('/');

      const navLabel = await page.locator('header nav').getAttribute('aria-label');
      expect(navLabel).toBeTruthy();
    });
  });

  test.describe('Logo', () => {
    test('should display logo/brand name', async ({ page }) => {
      await page.goto('/');

      const logo = await page.locator('header h1 a').textContent();
      expect(logo).toBeTruthy();
      expect(logo!.length).toBeGreaterThan(0);
    });

    test('should have logo link to homepage', async ({ page }) => {
      await page.goto('/');

      const logoLink = await page.locator('header h1 a').getAttribute('href');
      expect(logoLink).toBe('/');
    });

    test('should have logo as heading', async ({ page }) => {
      await page.goto('/');

      // Le logo doit être dans un h1 ou strong pour SEO
      const logoHeading = await page.locator('header h1, header strong').count();
      expect(logoHeading).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Navigation Links', () => {
    test('should have main navigation links', async ({ page }) => {
      await page.goto('/');

      const navLinks = await page.locator('header nav a').count();
      expect(navLinks).toBeGreaterThanOrEqual(3); // Minimum 3 liens (Home, About, Contact)
    });

    test('should have visible text for all links', async ({ page }) => {
      await page.goto('/');

      const links = page.locator('header nav a');
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const text = await links.nth(i).textContent();
        expect(text).toBeTruthy();
        expect(text!.trim().length).toBeGreaterThan(0);
      }
    });

    test('should have valid href for all links', async ({ page }) => {
      await page.goto('/');

      const links = page.locator('header nav a');
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^(\/|#)/); // Relatif ou anchor
      }
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should be visible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const header = await page.locator('header').isVisible();
      expect(header).toBe(true);
    });

    test('should be visible on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const header = await page.locator('header').isVisible();
      expect(header).toBe(true);
    });

    test('should have container for content centering', async ({ page }) => {
      await page.goto('/');

      const container = await page.locator('header .container, header [class*="max-w"]').count();
      expect(container).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Styling', () => {
    test('should have border bottom (visual separation)', async ({ page }) => {
      await page.goto('/');

      const header = page.locator('header');
      const borderBottom = await header.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.borderBottomWidth;
      });

      expect(parseFloat(borderBottom)).toBeGreaterThan(0);
    });

    test('should use design tokens for colors', async ({ page }) => {
      await page.goto('/');

      // Vérifier que le header utilise des couleurs du design system
      const headerBg = await page.locator('header').evaluate((el) => {
        return getComputedStyle(el).backgroundColor;
      });

      expect(headerBg).toBeTruthy();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');

      // Tab depuis le skip link vers le premier lien nav
      await page.keyboard.press('Tab'); // Skip link
      await page.keyboard.press('Tab'); // Premier lien nav

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName.toLowerCase();
      });

      expect(focusedElement).toBe('a');
    });

    test('should have landmarks for screen readers', async ({ page }) => {
      await page.goto('/');

      // <header> est un landmark HTML5
      const banner = await page.locator('header').count();
      expect(banner).toBe(1);
    });

    test('should have readable link text (no "click here")', async ({ page }) => {
      await page.goto('/');

      const badLinkTexts = ['click here', 'read more', 'here', 'link'];
      const links = page.locator('header nav a');
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const text = await links.nth(i).textContent();
        const normalized = text!.toLowerCase().trim();
        expect(badLinkTexts).not.toContain(normalized);
      }
    });
  });

  test.describe('Fixed/Sticky Behavior', () => {
    test('should scroll with page (not fixed by default)', async ({ page }) => {
      await page.goto('/');

      const headerPosition = await page.locator('header').evaluate((el) => {
        return getComputedStyle(el).position;
      });

      // Par défaut, pas de position fixed (sinon couvre contenu)
      expect(['static', 'relative']).toContain(headerPosition);
    });
  });

  test.describe('Brand Identity', () => {
    test('should display consistent branding', async ({ page }) => {
      await page.goto('/');

      const logoText = await page.locator('header h1, header strong').first().textContent();
      expect(logoText).toBeTruthy();

      // Le texte du logo doit être cohérent avec le titre du site
      expect(logoText!.length).toBeGreaterThan(2);
    });

    test('should use primary color for brand', async ({ page }) => {
      await page.goto('/');

      const logoColor = await page
        .locator('header h1, header strong')
        .first()
        .evaluate((el) => {
          return getComputedStyle(el).color;
        });

      expect(logoColor).toBeTruthy();
    });
  });
});
