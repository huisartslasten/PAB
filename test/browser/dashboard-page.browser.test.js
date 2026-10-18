import { test, expect } from '@playwright/test';
import { PACOGO_TEST_VERSION } from '../../src/components/page-template.js';

const baseUrl = 'http://127.0.0.1:4173';
const expectedVersionBadge = PACOGO_TEST_VERSION;

test('dashboard start page is a standalone student chooser', async ({ page }) => {
  await page.goto(`${baseUrl}/dashboard.html`);
  await expect(page.locator('.paco-template-version-badge')).toHaveCount(0);
  await expect(page.locator('.paco-template-sidebar')).toHaveCount(0);
  await expect(page.locator('.dashboard-chooser-title')).toHaveText('Wie gaat er leren?');
  await expect(page.getByRole('link', { name: /Dashboard van Zyon/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dashboard van Zenith/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dashboard van Zephon/ })).toBeVisible();

  await page.getByRole('link', { name: /Dashboard van Zyon/ }).click();
  await expect(page).toHaveURL(/\/dashboard\.html\?viewStudent=Zyon$/);
  await expect(page.locator('.paco-template-version-badge')).toHaveText(expectedVersionBadge);
  await expect(page.locator('.paco-template-main h1')).toHaveText('Dashboard');
  await expect(page.getByRole('button', { name: '← Start' })).toBeVisible();
  await expect(page.getByRole('button', { name: /📚 Mijn lessen/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /⚙️ Beheer/ })).toBeVisible();

  await page.getByRole('button', { name: /⚙️ Beheer/ }).click();
  await expect(page).toHaveURL(/\/auth\.html$/);
});
