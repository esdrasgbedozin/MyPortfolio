import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  timeout: 10000, // 10s par test (au lieu de 30s)
  expect: {
    timeout: 7000, // 7s pour les expect (assertions)
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx serve dist/client -l 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
