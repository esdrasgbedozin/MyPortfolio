import { test, expect } from '@playwright/test';

test.describe('Contact Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/contact');

    const heading = page.getByRole('heading', { level: 1, name: 'Me Contacter' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Vous avez un projet, une opportunité ou une question ?');
    await expect(description).toBeVisible();
  });

  test('should display enabled form fields', async ({ page }) => {
    await page.goto('/fr/contact');

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEnabled(); // Epic 6.2: Formulaire interactif

    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();

    const messageTextarea = page.locator('#message');
    await expect(messageTextarea).toBeVisible();
    await expect(messageTextarea).toBeEnabled();
  });

  test('should display enabled submit button', async ({ page }) => {
    await page.goto('/fr/contact');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled(); // Epic 6.2: Bouton actif
  });

  test('should have working form validation', async ({ page }) => {
    await page.goto('/fr/contact');

    // Epic 6.2 FE-083: Validation côté client
    const submitButton = page.locator('button[type="submit"]');

    // Soumettre formulaire vide devrait montrer erreurs
    await submitButton.click();

    // Vérifier présence de messages d'erreur (role="alert")
    const errors = page.locator('[role="alert"]');
    await expect(errors.first()).toBeVisible();
  });
});

test.describe('Contact Page (EN)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/en/contact');

    const heading = page.getByRole('heading', { level: 1, name: 'Contact Me' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Have a project, an opportunity, or a question?');
    await expect(description).toBeVisible();
  });

  test('should display enabled form fields', async ({ page }) => {
    await page.goto('/en/contact');

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEnabled(); // Epic 6.2: Formulaire interactif

    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();

    const messageTextarea = page.locator('#message');
    await expect(messageTextarea).toBeVisible();
    await expect(messageTextarea).toBeEnabled();
  });

  test('should display enabled submit button', async ({ page }) => {
    await page.goto('/en/contact');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled(); // Epic 6.2: Bouton actif
  });

  test('should have working form validation', async ({ page }) => {
    await page.goto('/en/contact');

    // Epic 6.2 FE-083: Validation côté client
    const submitButton = page.locator('button[type="submit"]');

    // Soumettre formulaire vide devrait montrer erreurs
    await submitButton.click();

    // Vérifier présence de messages d'erreur (role="alert")
    const errors = page.locator('[role="alert"]');
    await expect(errors.first()).toBeVisible();
  });
});
