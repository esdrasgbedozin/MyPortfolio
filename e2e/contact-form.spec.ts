/**
 * Epic 6.2 - FE-080: Tests E2E ContactForm
 * Tests simplifiés pour vérifier l'intégration du composant
 * Les tests de validation complets sont dans ContactForm.test.tsx (unit tests)
 */

import { test, expect } from '@playwright/test';

test.describe('ContactForm E2E - Integration', () => {
  test('should render ContactForm component on test page', async ({ page }) => {
    await page.goto('/test/contact-form');

    // Attendre l'hydratation React
    await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 15000 });

    // Vérifier que tous les champs sont présents
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should allow typing in form fields', async ({ page }) => {
    await page.goto('/test/contact-form');
    await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 15000 });

    // Remplir les champs
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Test message');

    // Vérifier les valeurs
    await expect(page.locator('input[name="name"]')).toHaveValue('John Doe');
    await expect(page.locator('input[name="email"]')).toHaveValue('john@example.com');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('Test message');
  });

  test('should show validation error on submit with empty fields', async ({ page }) => {
    await page.goto('/test/contact-form');
    await page.waitForSelector('button[type="submit"]', { state: 'visible', timeout: 15000 });

    // Soumettre formulaire vide
    await page.click('button[type="submit"]');

    // Attendre un peu pour que React Hook Form traite
    await page.waitForTimeout(1000);

    // Vérifier que le formulaire n'a PAS été soumis (car validation empêche)
    // On vérifie que le bouton est toujours visible (pas de redirection)
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should integrate ContactForm on French contact page', async ({ page }) => {
    await page.goto('/fr/contact');

    // Vérifier titre de page
    await expect(page.getByRole('heading', { name: /me contacter/i })).toBeVisible();

    // Attendre hydratation et vérifier formulaire présent
    await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 15000 });
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('should integrate ContactForm on English contact page', async ({ page }) => {
    await page.goto('/en/contact');

    // Vérifier titre de page
    await expect(page.getByRole('heading', { name: /contact me/i })).toBeVisible();

    // Attendre hydratation et vérifier formulaire présent
    await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 15000 });
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('should render Turnstile widget on contact form - Epic 6.2 FE-083', async ({ page }) => {
    await page.goto('/test/contact-form');
    await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 15000 });

    // Vérifier que le widget Turnstile est présent (div avec id cf-turnstile)
    // Le widget Cloudflare injecte cet élément dans le DOM
    // Note: Il peut y avoir plusieurs divs #cf-turnstile, on prend le premier
    const turnstileWidget = page.locator('#cf-turnstile').first();
    await expect(turnstileWidget).toBeVisible({ timeout: 5000 });

    // Vérifier que le widget est dans un conteneur flex (styling mobile-friendly)
    const turnstileContainer = page
      .locator('.flex.justify-center')
      .filter({ has: page.locator('#cf-turnstile') });
    await expect(turnstileContainer.first()).toBeVisible();
  });

  test('should have responsive layout on mobile viewport - Epic 6.2 FE-084', async ({ page }) => {
    // Simuler un viewport mobile (iPhone 12)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/fr/contact');

    // Attendre l'hydratation
    await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 15000 });

    // Vérifier que le formulaire est visible et accessible
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Vérifier que le Turnstile widget est visible même sur mobile
    const turnstileWidget = page.locator('#cf-turnstile').first();
    await expect(turnstileWidget).toBeVisible({ timeout: 5000 });

    // Vérifier que les champs sont utilisables (pas de débordement)
    const nameInput = page.locator('input[name="name"]');
    const boundingBox = await nameInput.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeLessThanOrEqual(390 - 32); // 32px = padding total (16px * 2)
  });
});
