import { test, expect } from '@playwright/test';

test.describe('Projects Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/projects');

    const heading = page.getByRole('heading', { level: 1, name: 'Mes Projets' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Découvrez mes réalisations techniques');
    await expect(description).toBeVisible();
  });

  test('should display project cards in grid', async ({ page }) => {
    await page.goto('/fr/projects');

    const articles = page.locator('article');
    await expect(articles).toHaveCount(3);
  });

  test('should display project details', async ({ page }) => {
    await page.goto('/fr/projects');

    // Portfolio project
    await expect(
      page.getByRole('heading', { level: 3, name: 'Portfolio Professionnel' })
    ).toBeVisible();

    // Use more specific selectors for tech badges - first() to avoid strict mode
    const astroBadge = page.getByTestId('tech-badge').filter({ hasText: /^Astro$/ });
    await expect(astroBadge.first()).toBeVisible();

    const reactBadge = page.getByTestId('tech-badge').filter({ hasText: /^React$/ });
    await expect(reactBadge.first()).toBeVisible();

    await expect(page.getByText('2026').first()).toBeVisible(); // startDate année
    await expect(page.getByText('development').first()).toBeVisible();
  });

  test('should display project links when provided', async ({ page }) => {
    await page.goto('/fr/projects');

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
    // Note: archived status removed - we only have production/development in dummy data
  });
});

// FE-063: Test page détail projet
test.describe('Project Detail Page (FR)', () => {
  test('should display project detail page at /fr/projects/[slug]', async ({ page }) => {
    await page.goto('/fr/projects/portfolio');

    // Check page title matches project title - use first() as MDX also has H1
    const heading = page.locator('main h1').filter({ hasText: 'Portfolio Professionnel' }).first();
    await expect(heading).toBeVisible();
  });

  test('should display project metadata (dates, category, status)', async ({ page }) => {
    await page.goto('/fr/projects/portfolio');

    // Dates should be formatted in French
    await expect(page.getByText(/Démarré/)).toBeVisible();

    // Category badge - use first() as "web" appears in MDX content
    await expect(page.getByText('Web').first()).toBeVisible();

    // Status badge
    await expect(page.getByText('En cours')).toBeVisible();
  });

  test('should display technologies badges', async ({ page }) => {
    await page.goto('/fr/projects/portfolio');

    // Tech badges are in header metadata section
    // Since tech names appear in description/MDX, look in the article header
    const article = page.locator('article.container');
    await expect(article.getByText('Astro', { exact: true }).first()).toBeVisible();
    await expect(article.getByText('React', { exact: true }).first()).toBeVisible();
    await expect(article.getByText('Vercel', { exact: true }).first()).toBeVisible();
  });

  test('should render MDX content from project file', async ({ page }) => {
    await page.goto('/fr/projects/portfolio');

    // Check for content from MDX body
    await expect(page.locator('article.prose')).toBeVisible();

    // Verify MDX content is rendered (headings, lists, etc.)
    const content = page.locator('article.prose');
    const elements = await content.locator('h2, h3, p, ul').count();
    expect(elements).toBeGreaterThan(0);
  });

  test('should display GitHub link when available', async ({ page }) => {
    await page.goto('/fr/projects/portfolio');

    const githubLink = page.getByRole('link', { name: /Code Source/i });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/esdrasgbedozin/MyPortfolio'
    );
  });

  test('should display live demo link when available', async ({ page }) => {
    await page.goto('/fr/projects/fitness-app'); // fitness-app has liveUrl

    const demoLink = page.getByRole('link', { name: /Démo Live/i });
    await expect(demoLink).toBeVisible();
  });

  test('should handle project without endDate (in-progress)', async ({ page }) => {
    await page.goto('/fr/projects/portfolio');

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
    await expect(page.getByText(/Completed/).first()).toBeVisible(); // "Completed:" label
    await expect(page.getByText('Completed', { exact: true }).last()).toBeVisible(); // Status badge
  });
});
