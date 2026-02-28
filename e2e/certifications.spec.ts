import { test, expect } from '@playwright/test';

test.describe('Certifications Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/certifications');

    const heading = page.getByRole('heading', { level: 1, name: 'Certifications' });
    await expect(heading).toBeVisible();

    const description = page.getByText(
      'Mes certifications professionnelles attestant de mes compétences techniques et de mon engagement'
    );
    await expect(description).toBeVisible();
  });

  test('should display certification cards in grid', async ({ page }) => {
    await page.goto('/fr/certifications');

    const articles = page.locator('article');
    await expect(articles).toHaveCount(10);
  });

  test('should display certification details', async ({ page }) => {
    await page.goto('/fr/certifications');

    // Google Associate Cloud Engineer (first certification)
    await expect(
      page.getByRole('heading', {
        level: 3,
        name: 'Google Associate Cloud Engineer',
      })
    ).toBeVisible();
    await expect(page.getByText('Google Cloud').first()).toBeVisible();
  });

  test('should display active status badge', async ({ page }) => {
    await page.goto('/fr/certifications');

    const badges = page.getByText('Actif');
    await expect(badges.first()).toBeVisible();
  });
});

test.describe('Certifications Page (EN)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/en/certifications');

    const heading = page.getByRole('heading', { level: 1, name: 'Certifications' });
    await expect(heading).toBeVisible();

    const description = page.getByText(
      'My professional certifications demonstrating technical expertise and commitment'
    );
    await expect(description).toBeVisible();
  });

  test('should display certification cards in grid', async ({ page }) => {
    await page.goto('/en/certifications');

    const articles = page.locator('article');
    await expect(articles).toHaveCount(10);
  });

  test('should display active status badge', async ({ page }) => {
    await page.goto('/en/certifications');

    const badges = page.getByText('Active');
    await expect(badges.first()).toBeVisible();
  });
});
