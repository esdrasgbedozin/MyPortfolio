import { test, expect } from '@playwright/test';

test.describe('Skills Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/skills');

    const heading = page.getByRole('heading', { level: 1, name: 'Compétences' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Technologies, frameworks et méthodologies que je maîtrise');
    await expect(description).toBeVisible();
  });

  test('should display all skill categories', async ({ page }) => {
    await page.goto('/fr/skills');

    const categories = [
      'Cloud & Infrastructure',
      'DevOps & CI/CD',
      'Développement Backend',
      'Architecture Logicielle',
      'Développement Frontend',
      'Qualité & Tests',
      'Data & Bases de Données',
      'Sécurité & Cryptographie',
      'Intelligence Artificielle',
      'Langues',
    ];

    for (const category of categories) {
      await expect(page.getByRole('heading', { level: 2, name: category })).toBeVisible();
    }
  });

  test('should display skill badges', async ({ page }) => {
    await page.goto('/fr/skills');

    // Backend
    await expect(page.getByText('Python', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('JavaScript', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('TypeScript', { exact: true }).first()).toBeVisible();

    // Frontend
    await expect(page.getByText('React.js', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Astro', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Next.js', { exact: true }).first()).toBeVisible();

    // Quality & Tests
    await expect(page.getByText('TDD', { exact: true }).first()).toBeVisible();
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

    const categories = [
      'Cloud & Infrastructure',
      'DevOps & CI/CD',
      'Backend Development',
      'Software Architecture',
      'Frontend Development',
      'Quality & Testing',
      'Data & Databases',
      'Security & Cryptography',
      'Artificial Intelligence',
      'Languages',
    ];

    for (const category of categories) {
      await expect(page.getByRole('heading', { level: 2, name: category })).toBeVisible();
    }
  });

  test('should display skill badges', async ({ page }) => {
    await page.goto('/en/skills');

    await expect(page.getByText('TypeScript', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('React.js', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('TDD', { exact: true }).first()).toBeVisible();
  });
});
