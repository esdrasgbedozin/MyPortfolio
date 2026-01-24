import { test, expect } from '@playwright/test';

test.describe('Projects Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/projets');

    const heading = page.getByRole('heading', { level: 1, name: 'Mes Projets' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Découvrez mes réalisations techniques');
    await expect(description).toBeVisible();
  });

  test('should display project cards in grid', async ({ page }) => {
    await page.goto('/fr/projets');

    const articles = page.locator('article');
    await expect(articles).toHaveCount(3);
  });

  test('should display project details', async ({ page }) => {
    await page.goto('/fr/projets');

    // Portfolio project
    await expect(
      page.getByRole('heading', { level: 3, name: 'Portfolio Professionnel' })
    ).toBeVisible();

    // Use more specific selectors for tech badges
    const astroBadge = page.getByTestId('tech-badge').filter({ hasText: 'Astro' });
    await expect(astroBadge).toBeVisible();

    const reactBadge = page.getByTestId('tech-badge').filter({ hasText: 'React' });
    await expect(reactBadge).toBeVisible();

    await expect(page.getByText('2024')).toBeVisible();
    await expect(page.getByText('development')).toBeVisible();
  });

  test('should display project links when provided', async ({ page }) => {
    await page.goto('/fr/projets');

    // Repository link for Portfolio
    const repoLinks = page.getByRole('link', { name: /Code/ });
    await expect(repoLinks.first()).toBeVisible();
    await expect(repoLinks.first()).toHaveAttribute(
      'href',
      'https://github.com/esdrasgbedozin/MyPortfolio'
    );

    // Demo link for E-Commerce
    const demoLinks = page.getByRole('link', { name: /Demo/ });
    await expect(demoLinks.first()).toBeVisible();
  });
});

test.describe('Projects Page (EN)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/en/projects');

    const heading = page.getByRole('heading', { level: 1, name: 'My Projects' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Discover my technical achievements');
    await expect(description).toBeVisible();
  });

  test('should display project cards in grid', async ({ page }) => {
    await page.goto('/en/projects');

    const articles = page.locator('article');
    await expect(articles).toHaveCount(3);
  });

  test('should display project with status badge', async ({ page }) => {
    await page.goto('/en/projects');

    await expect(page.getByText('production')).toBeVisible();
    await expect(page.getByText('development')).toBeVisible();
    await expect(page.getByText('archived')).toBeVisible();
  });
});
