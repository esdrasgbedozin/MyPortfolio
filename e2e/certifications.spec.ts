import { test, expect } from '@playwright/test';

test.describe('Certifications Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/certifications');

    const heading = page.getByRole('heading', { level: 1, name: 'Certifications' });
    await expect(heading).toBeVisible();

    const description = page.getByText(
      'Mes certifications professionnelles attestant de mes compétences'
    );
    await expect(description).toBeVisible();
  });

  test('should display certification cards in grid', async ({ page }) => {
    await page.goto('/fr/certifications');

    const articles = page.locator('article');
    await expect(articles).toHaveCount(3);
  });

  test('should display certification details', async ({ page }) => {
    await page.goto('/fr/certifications');

    // Azure certification
    await expect(
      page.getByRole('heading', {
        level: 3,
        name: 'Azure Solutions Architect Expert',
      })
    ).toBeVisible();
    await expect(page.getByText('Microsoft')).toBeVisible();
    await expect(page.getByText('Obtenue : Janvier 2024')).toBeVisible();
    await expect(page.getByText('ID : AZ-305-2024-001')).toBeVisible();
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
      'My professional certifications demonstrating technical expertise'
    );
    await expect(description).toBeVisible();
  });

  test('should display certification cards in grid', async ({ page }) => {
    await page.goto('/en/certifications');

    const articles = page.locator('article');
    await expect(articles).toHaveCount(3);
  });

  test('should display active status badge', async ({ page }) => {
    await page.goto('/en/certifications');

    const badges = page.getByText('Active');
    await expect(badges.first()).toBeVisible();
  });
});
