import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/smoke',
  timeout: 30000,
  workers: 1,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.SMOKE_URL || 'https://playground.smtmtc.com',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
