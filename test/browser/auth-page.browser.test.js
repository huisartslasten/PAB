import { test, expect } from '@playwright/test';
import { PACOGO_TEST_VERSION } from '../../src/components/page-template.js';

const baseUrl = 'http://127.0.0.1:4173';
const expectedVersionBadge = `PacoGO TEST ${PACOGO_TEST_VERSION}`;

test('auth page is the canonical login and password reset boundary', async ({ page }) => {
  await page.goto(`${baseUrl}/auth.html`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText(expectedVersionBadge);
  await expect(page.locator('.paco-template-main h1')).toHaveText('Inloggen');
  await expect(page.locator('#authEmail')).toBeVisible();
  await expect(page.locator('#authPassword')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Wachtwoord vergeten' })).toBeVisible();

  await page.getByRole('button', { name: 'Wachtwoord vergeten' }).click();
  await expect(page.locator('.paco-template-main h1')).toHaveText('Inloggen');
  await expect(page.locator('#resetEmail')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Resetlink sturen' })).toBeVisible();
});
