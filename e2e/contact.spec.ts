import { test, expect } from '@playwright/test';

test.describe('Contact Page (FR)', () => {
  test('should display page title and description', async ({ page }) => {
    await page.goto('/fr/contact');

    const heading = page.getByRole('heading', { level: 1, name: 'Me Contacter' });
    await expect(heading).toBeVisible();

    const description = page.getByText('Vous avez un projet, une opportunité ou une question ?');
    await expect(description).toBeVisible();
  });

  test('should display disabled form fields', async ({ page }) => {
    await page.goto('/fr/contact');

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeDisabled();

    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeDisabled();

    const messageTextarea = page.locator('#message');
    await expect(messageTextarea).toBeVisible();
    await expect(messageTextarea).toBeDisabled();
  });

  test('should display disabled submit button', async ({ page }) => {
    await page.goto('/fr/contact');

    const submitButton = page.getByRole('button', {
      name: 'Envoyer (Prochainement)',
    });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test('should display note about future implementation', async ({ page }) => {
    await page.goto('/fr/contact');

    const note = page.getByText(
      'Le formulaire interactif avec validation et anti-spam sera disponible dans la Phase 6'
    );
    await expect(note).toBeVisible();
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

  test('should display disabled form fields', async ({ page }) => {
    await page.goto('/en/contact');

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeDisabled();

    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeDisabled();

    const messageTextarea = page.locator('#message');
    await expect(messageTextarea).toBeVisible();
    await expect(messageTextarea).toBeDisabled();
  });

  test('should display disabled submit button', async ({ page }) => {
    await page.goto('/en/contact');

    const submitButton = page.getByRole('button', { name: 'Send (Coming Soon)' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test('should display note about future implementation', async ({ page }) => {
    await page.goto('/en/contact');

    const note = page.getByText(
      'Interactive form with validation and anti-spam will be available in Phase 6'
    );
    await expect(note).toBeVisible();
  });
});
