import { test, expect } from '@playwright/test';

test('homepage displays correctly', async ({ page }) => {
  await page.goto('/');

  // After redirect to /fr
  await expect(page).toHaveTitle(/Portfolio/);
  await expect(page.getByRole('heading', { level: 1, name: 'Esdras GBEDOZIN' })).toBeVisible();
  await expect(page.getByText('Ingénieur Informatique')).toBeVisible();
});
