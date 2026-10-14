import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

test('creator console is a canonical protected page boundary', async ({ page }) => {
  await page.goto(`${baseUrl}/creator.html`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText('PacoGO TEST V5.14');
  await expect(page.locator('.paco-template-main h1')).toHaveText('Creator Console');
  await expect(page.getByText(/Alleen de hoofdbeheerder heeft toegang/)).toBeVisible();
});

test('management exposes the canonical creator console destination', async ({ page }) => {
  await page.goto(`${baseUrl}/management.html`);
  await expect(page.getByRole('button', { name: /Creator Console/ })).toBeVisible();
});
