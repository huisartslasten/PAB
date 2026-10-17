import { test, expect } from '@playwright/test';
import { PACOGO_TEST_VERSION } from '../../src/components/page-template.js';

const baseUrl = 'http://127.0.0.1:4173';
const expectedVersionBadge = PACOGO_TEST_VERSION;

test('creator console is a canonical protected page boundary', async ({ page }) => {
  await page.goto(`${baseUrl}/creator.html`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText(expectedVersionBadge);
  await expect(page.locator('.paco-template-main h1')).toHaveText('Creator Console');
  await expect(page.getByText(/Alleen de hoofdbeheerder heeft toegang/)).toBeVisible();
  await expect(page.getByRole('button', { name: /⚙️ Beheer/ })).toBeVisible();
});

test('management route remains protected before creator navigation is available', async ({ page }) => {
  await page.goto(`${baseUrl}/management.html`);
  await expect(page).toHaveURL(/\/auth\.html$/);
});
