/**
 * Accessibility Tests - FE-100
 *
 * Automated accessibility audit using axe-core + Playwright
 * Standard: WCAG 2.1 Level AA
 * Runs on all pages in both languages
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// All pages to audit for accessibility
const pages = [
  { url: '/fr', name: 'Accueil FR' },
  { url: '/en', name: 'Home EN' },
  { url: '/fr/projects', name: 'Projets FR' },
  { url: '/en/projects', name: 'Projects EN' },
  { url: '/fr/skills', name: 'Compétences FR' },
  { url: '/en/skills', name: 'Skills EN' },
  { url: '/fr/certifications', name: 'Certifications FR' },
  { url: '/en/certifications', name: 'Certifications EN' },
  { url: '/fr/contact', name: 'Contact FR' },
  { url: '/en/contact', name: 'Contact EN' },
  { url: '/fr/about', name: 'À Propos FR' },
  { url: '/en/about', name: 'About EN' },
];

test.describe('Accessibility - WCAG 2.1 AA', () => {
  for (const page of pages) {
    test(`should have no critical a11y violations on ${page.name}`, async ({
      page: browserPage,
    }) => {
      await browserPage.goto(page.url);

      // Wait for page to be fully loaded
      await browserPage.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Exclude third-party widgets that we don't control
        .exclude('#cf-turnstile-container')
        .analyze();

      // Filter only critical and serious violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      // Log violations for debugging
      if (criticalViolations.length > 0) {
        console.warn(
          `\n❌ A11y violations on ${page.name}:\n`,
          criticalViolations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
            help: v.helpUrl,
          }))
        );
      }

      expect(criticalViolations).toHaveLength(0);
    });
  }

  test('should have correct heading hierarchy on homepage', async ({ page: browserPage }) => {
    await browserPage.goto('/fr');
    await browserPage.waitForLoadState('networkidle');

    // Check that h1 exists
    const h1 = browserPage.locator('h1');
    await expect(h1.first()).toBeVisible();

    // Check heading hierarchy (no skipping levels)
    const headings = await browserPage.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(elements).map((el) => ({
        level: parseInt(el.tagName.replace('H', '')),
        text: el.textContent?.trim().substring(0, 50) || '',
      }));
    });

    // Verify h1 exists
    expect(headings.some((h) => h.level === 1)).toBe(true);

    // Verify no heading level is skipped (h1 → h3 without h2)
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i].level;
      const previous = headings[i - 1].level;
      // Going deeper should not skip more than 1 level
      if (current > previous) {
        expect(current - previous).toBeLessThanOrEqual(1);
      }
    }
  });

  test('should support keyboard navigation', async ({ page: browserPage }) => {
    await browserPage.goto('/fr');
    await browserPage.waitForLoadState('networkidle');

    // Tab through the page - skip-to-content link should be first
    await browserPage.keyboard.press('Tab');
    const skipLink = browserPage.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // Continue tabbing to nav links
    await browserPage.keyboard.press('Tab');

    // Verify focused element is visible and has focus indicator
    const focusedElement = browserPage.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page: browserPage }) => {
    await browserPage.goto('/fr');
    await browserPage.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
      .withRules(['color-contrast'])
      .analyze();

    // Log contrast issues
    if (accessibilityScanResults.violations.length > 0) {
      console.warn(
        '\n⚠️ Color contrast issues:\n',
        accessibilityScanResults.violations.map((v) => ({
          nodes: v.nodes.map((n) => ({
            html: n.html.substring(0, 100),
            message: n.failureSummary,
          })),
        }))
      );
    }

    // Allow minor contrast issues (not critical blockers)
    const criticalContrast = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalContrast).toHaveLength(0);
  });

  test('should have proper ARIA attributes on interactive elements', async ({
    page: browserPage,
  }) => {
    await browserPage.goto('/fr/contact');
    await browserPage.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
      .withRules([
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-valid-attr',
        'aria-valid-attr-value',
        'label',
        'input-button-name',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test('should support prefers-reduced-motion', async ({ page: browserPage }) => {
    // Emulate reduced motion preference
    await browserPage.emulateMedia({ reducedMotion: 'reduce' });
    await browserPage.goto('/fr');
    await browserPage.waitForLoadState('networkidle');

    // Verify page loads without issues with reduced motion
    const h1 = browserPage.locator('h1');
    await expect(h1.first()).toBeVisible();
  });
});
