import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

async function expectCanonicalShell(page, path, title) {
  await page.goto(`${baseUrl}/${path}`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText('PacoGO TEST V5.12');
  await expect(page.locator('.paco-template-hero')).toBeVisible();
  await expect(page.locator('.paco-template-sidebar')).toBeVisible();
  await expect(page.locator('.paco-template-main h1')).toHaveText(title);
  await expect(page.locator('.paco-template-nav-submenu')).toHaveCount(0);
}

test('dashboard page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'dashboard.html?student=Zyon', 'Dashboard');
  await expect(page.locator('.dashboard-page')).toBeVisible();
  await expect(page.locator('.dashboard-student')).toHaveText('Leerling: Zyon');
});

test('test page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'test.html', 'Toets');
  await expect(page.locator('#testProgress')).toHaveCount(1);
  await expect(page.locator('#testContent')).toHaveCount(1);
  await expect(page.locator('#result')).toHaveCount(1);
});

test('lesson view uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'lesson-view.html', 'Les bekijken');
});

test('questions page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'questions.html', 'Vragen maken');
});
