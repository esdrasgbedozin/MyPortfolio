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

    // Use more specific selectors for tech badges - first() to avoid strict mode
    const astroBadge = page.getByTestId('tech-badge').filter({ hasText: /^Astro$/ });
    await expect(astroBadge.first()).toBeVisible();

    const reactBadge = page.getByTestId('tech-badge').filter({ hasText: /^React$/ });
    await expect(reactBadge.first()).toBeVisible();

    await expect(page.getByText('2026')).toBeVisible(); // startDate année
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

    // Use first() to avoid strict mode violation
    await expect(page.getByText('production').first()).toBeVisible();
    await expect(page.getByText('development').first()).toBeVisible();
    await expect(page.getByText('archived').first()).toBeVisible();
  });
});

// FE-063: Test page détail projet
test.describe('Project Detail Page (FR)', () => {
  test('should display project detail page at /fr/projets/[slug]', async ({ page }) => {
    await page.goto('/fr/projets/portfolio');

    // Check page title matches project title
    const heading = page.getByRole('heading', { level: 1, name: 'Portfolio Professionnel' });
    await expect(heading).toBeVisible();
  });

  test('should display project metadata (dates, category, status)', async ({ page }) => {
    await page.goto('/fr/projets/portfolio');

    // Dates should be formatted in French
    await expect(page.getByText(/Démarré/)).toBeVisible();

    // Category badge
    await expect(page.getByText('web')).toBeVisible();

    // Status badge
    await expect(page.getByText('En cours')).toBeVisible();
  });

  test('should display technologies badges', async ({ page }) => {
    await page.goto('/fr/projets/portfolio');

    await expect(page.getByText('Astro')).toBeVisible();
    await expect(page.getByText('React')).toBeVisible();
    await expect(page.getByText('Vercel')).toBeVisible();
  });

  test('should render MDX content from project file', async ({ page }) => {
    await page.goto('/fr/projets/portfolio');

    // Check for content from MDX body
    await expect(page.locator('article.prose')).toBeVisible();

    // Verify MDX content is rendered (headings, lists, etc.)
    const content = page.locator('article.prose');
    const elements = await content.locator('h2, h3, p, ul').count();
    expect(elements).toBeGreaterThan(0);
  });

  test('should display GitHub link when available', async ({ page }) => {
    await page.goto('/fr/projets/portfolio');

    const githubLink = page.getByRole('link', { name: /Code Source/i });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/esdrasgbedozin/MyPortfolio'
    );
  });

  test('should display live demo link when available', async ({ page }) => {
    await page.goto('/fr/projets/api-ecommerce');

    const demoLink = page.getByRole('link', { name: /Démo Live/i });
    await expect(demoLink).toBeVisible();
  });

  test('should handle project without endDate (in-progress)', async ({ page }) => {
    await page.goto('/fr/projets/portfolio');

    // Should show "Démarré: [date]" without "Terminé:"
    await expect(page.getByText(/Démarré/)).toBeVisible();
    await expect(page.getByText(/Terminé/)).not.toBeVisible();
  });
});

test.describe('Project Detail Page (EN)', () => {
  test('should display project detail page at /en/projects/[slug]', async ({ page }) => {
    await page.goto('/en/projects/portfolio');

    const heading = page.getByRole('heading', { level: 1, name: 'Professional Portfolio' });
    await expect(heading).toBeVisible();
  });

  test('should display project metadata in English', async ({ page }) => {
    await page.goto('/en/projects/portfolio');

    // English date format
    await expect(page.getByText(/Started/)).toBeVisible();

    // Status badge in English
    await expect(page.getByText('In Progress')).toBeVisible();
  });

  test('should render MDX content from English project file', async ({ page }) => {
    await page.goto('/en/projects/portfolio');

    const content = page.locator('article.prose');
    await expect(content).toBeVisible();
    const elements = await content.locator('h2, h3, p, ul').count();
    expect(elements).toBeGreaterThan(0);
  });

  test('should display completed project with endDate', async ({ page }) => {
    await page.goto('/en/projects/api-ecommerce');

    await expect(page.getByText(/Started/)).toBeVisible();
    await expect(page.getByText(/Completed/)).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible(); // Status badge
  });
});
