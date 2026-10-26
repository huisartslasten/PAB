import { test, expect } from '@playwright/test';
import { PACOGO_TEST_VERSION } from '../../src/components/page-template.js';

const baseUrl = 'http://127.0.0.1:4173';
const expectedVersionBadge = PACOGO_TEST_VERSION;

async function expectCanonicalShell(page, path, title) {
  await page.goto(`${baseUrl}/${path}`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText(expectedVersionBadge);
  await expect(page.locator('.paco-template-hero')).toBeVisible();
  await expect(page.locator('.paco-template-sidebar')).toBeVisible();
  await expect(page.locator('.paco-template-main h1')).toHaveText(title);
}

async function expectSharedSidebar(page) {
  await expect(page.locator('.paco-template-nav-submenu')).toHaveCount(1);
  await expect(page.locator('.paco-template-nav-subitem')).toHaveText([
    'Agenda invoeren',
    'Maandkalender'
  ]);
}

test('dashboard page uses the canonical shell for a selected student', async ({ page }) => {
  await expectCanonicalShell(page, 'dashboard.html?viewStudent=Zyon', 'Dashboard');
  await expect(page.locator('.dashboard-page')).toBeVisible();
  await expect(page.locator('.dashboard-student')).toHaveCount(0);
  await expect(page.getByText('Andere leerling', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Jouw voortgang', { exact: true })).toHaveCount(0);
});

test('dashboard start page is outside the canonical shell', async ({ page }) => {
  await page.goto(`${baseUrl}/dashboard.html`);
  await expect(page.locator('.paco-template-version-badge')).toHaveCount(0);
  await expect(page.locator('.paco-template-sidebar')).toHaveCount(0);
  await expect(page.locator('.dashboard-chooser-title')).toHaveText('Wie gaat er leren?');
  await expect(page.locator('.dashboard-chooser-student')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /Dashboard van Zyon/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dashboard van Zenith/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dashboard van Zephon/ })).toBeVisible();
});

test('management page enforces the canonical authentication boundary', async ({ page }) => {
  await page.goto(`${baseUrl}/management.html`);
  await expect(page).toHaveURL(/\/auth\.html$/);
});

test('test page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'test.html', 'Toets');
  await expect(page.locator('#practiceProgress')).toHaveCount(1);
  await expect(page.locator('#practiceContent')).toHaveCount(1);
});

test('test history page uses the canonical shared sidebar', async ({ page }) => {
  await expectCanonicalShell(page, 'test-history.html?viewStudent=Zyon', 'Toetsgeschiedenis');
  await expectSharedSidebar(page);
  await expect(page.locator('#testHistoryContent')).toHaveCount(1);
  await expect(page.getByText('Bekijk de gemaakte toetsen van Zyon.')).toBeVisible();
});

test('lesson view uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'lesson-view.html', 'Les bekijken');
});

test('questions page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'questions.html', 'Vragen maken');
});
