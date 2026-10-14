import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

test('auth page is the canonical login and password reset boundary', async ({ page }) => {
  await page.goto(`${baseUrl}/auth.html`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText('PacoGO TEST V5.14');
  await expect(page.locator('.paco-template-main h1')).toHaveText('Inloggen');
  await expect(page.locator('#authEmail')).toBeVisible();
  await expect(page.locator('#authPassword')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Wachtwoord vergeten' })).toBeVisible();

  await page.getByRole('button', { name: 'Wachtwoord vergeten' }).click();
  await expect(page.locator('.paco-template-main h1')).toHaveText('Inloggen');
  await expect(page.locator('#resetEmail')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Resetlink sturen' })).toBeVisible();
});
