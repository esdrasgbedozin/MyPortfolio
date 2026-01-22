import { test, expect } from '@playwright/test';

test('homepage displays correctly', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Portfolio/);
  await expect(page.getByRole('heading', { name: /Portfolio Professionnel/i })).toBeVisible();
});
