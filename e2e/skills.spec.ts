import { test, expect } from '@playwright/test';

test.describe('Skills Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/competences');

    const heading = page.getByRole('heading', { level: 1, name: 'Compétences' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Technologies, frameworks et méthodologies que je maîtrise');
    await expect(description).toBeVisible();
  });

  test('should display all skill categories', async ({ page }) => {
    await page.goto('/fr/competences');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Langages de programmation' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Frameworks & Bibliothèques' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Cloud & DevOps' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Bases de données' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Méthodologies & Pratiques' })
    ).toBeVisible();
  });

  test('should display skill badges', async ({ page }) => {
    await page.goto('/fr/competences');

    // Languages
    await expect(page.getByText('TypeScript')).toBeVisible();
    await expect(page.getByText('JavaScript')).toBeVisible();
    await expect(page.getByText('Python')).toBeVisible();

    // Frameworks
    await expect(page.getByText('React')).toBeVisible();
    await expect(page.getByText('Astro')).toBeVisible();
    await expect(page.getByText('Next.js')).toBeVisible();

    // Methodologies
    await expect(page.getByText('TDD')).toBeVisible();
    await expect(page.getByText('Agile / Scrum')).toBeVisible();
  });
});

test.describe('Skills Page (EN)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/en/skills');

    const heading = page.getByRole('heading', { level: 1, name: 'Skills' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Technologies, frameworks and methodologies I master');
    await expect(description).toBeVisible();
  });

  test('should display all skill categories', async ({ page }) => {
    await page.goto('/en/skills');

    await expect(
      page.getByRole('heading', { level: 2, name: 'Programming Languages' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Frameworks & Libraries' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Cloud & DevOps' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Databases' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Methodologies & Practices' })
    ).toBeVisible();
  });

  test('should display skill badges', async ({ page }) => {
    await page.goto('/en/skills');

    await expect(page.getByText('TypeScript')).toBeVisible();
    await expect(page.getByText('React')).toBeVisible();
    await expect(page.getByText('TDD')).toBeVisible();
  });
});
