import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

async function expectCanonicalShell(page, path, title) {
  await page.goto(`${baseUrl}/${path}`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText('PacoGO TEST V5.14');
  await expect(page.locator('.paco-template-hero')).toBeVisible();
  await expect(page.locator('.paco-template-sidebar')).toBeVisible();
  await expect(page.locator('.paco-template-main h1')).toHaveText(title);
  await expect(page.locator('.paco-template-nav-submenu')).toHaveCount(0);
}

test('lessons uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'lessons.html', 'Mijn lessen');
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn lessen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toetsen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn agenda' })).toBeVisible();
});

test('lessons dashboard navigation targets the canonical dashboard', async ({ page }) => {
  await page.goto(`${baseUrl}/lessons.html?student=Zyon`);
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await expect(page).toHaveURL(/\/dashboard\.html\?student=Zyon$/);
  await expect(page.locator('.paco-template-main h1')).toHaveText('Dashboard');
});

test('lesson choice uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'lesson-choice.html?lesson_id=1&student=Zyon', 'Leskeuze');
});

test('questions uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'questions.html', 'Vragen maken');
});

test('oefenen uses the canonical shell without dead submenu controls', async ({ page }) => {
  await expectCanonicalShell(page, 'oefenen.html', 'Oefenen');
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn lessen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toetsen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn agenda' })).toBeVisible();
});

test('flashcards uses the canonical shell and returns to oefenen', async ({ page }) => {
  await expectCanonicalShell(page, 'flashcards-template.html', 'Flashcards');
  const oefenenButton = page.locator('.paco-template-nav-item').filter({ hasText: 'Oefenen' });
  await expect(oefenenButton).toBeVisible();
  await expect(page.getByRole('button', { name: 'Flashcards' })).toBeVisible();
  await oefenenButton.click();
  await expect(page).toHaveURL(/\/oefenen\.html(?:\?.*)?$/);
});
