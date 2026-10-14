import { test, expect } from '@playwright/test';
test('production serves assets and renders a working first game', async ({
  page,
  request,
  baseURL,
}) => {
  if (!baseURL) throw new Error('SMOKE_URL is required');
  if (!baseURL.startsWith('http://127.0.0.1')) expect(baseURL).toMatch(/^https:\/\//);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Frontend Experiment Arcade — Riskiyanto');
  await expect(page.getByRole('heading', { name: 'Box Model Lab.' })).toBeVisible();
  await expect(
    page.frameLocator('iframe[title="Live preview arena"]').getByText('Paket frontend'),
  ).toBeVisible();
  const version = await request.get('/version.json');
  expect(version.status()).toBe(200);
  expect(await version.json()).toMatchObject({
    version: '1.0.0',
    commit: expect.any(String),
    builtAt: expect.any(String),
  });
  const script = await page.locator('script[src]').first().getAttribute('src');
  expect(script).toBeTruthy();
  expect((await request.get(script!)).status()).toBe(200);
  await page.getByRole('button', { name: 'Periksa hasil' }).click();
  await expect(page.getByText('Hampir sampai. Coba satu perubahan lagi.')).toBeVisible();
  expect(errors).toEqual([]);
});
