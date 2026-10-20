import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

test('games uses the canonical shell and remains openable without a lesson selection', async ({ page }) => {
  await page.goto(`${baseUrl}/games.html?student=Zyon`);
  await expect(page.locator('.paco-template-hero')).toBeVisible();
  await expect(page.locator('.paco-template-sidebar')).toBeVisible();
  await expect(page.locator('.paco-template-main h1')).toHaveText('Spelletjes');
  await expect(page.getByText('Geen les geselecteerd.')).toBeVisible();
});

test('Double or Nothing uses the canonical shell and remains openable without a lesson selection', async ({ page }) => {
  await page.goto(`${baseUrl}/double-or-nothing.html?student=Zyon`);
  await expect(page.locator('.paco-template-hero')).toBeVisible();
  await expect(page.locator('.paco-template-sidebar')).toBeVisible();
  await expect(page.locator('.paco-template-main h1')).toHaveText('Double or Nothing');
  await expect(page.getByText('Geen les geselecteerd.')).toBeVisible();
});
