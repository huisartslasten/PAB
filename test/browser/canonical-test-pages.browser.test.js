import { test, expect } from '@playwright/test';
import { PACOGO_TEST_VERSION } from '../../src/components/page-template.js';

const baseUrl = 'http://127.0.0.1:4173';
const expectedVersionBadge = `PacoGO TEST ${PACOGO_TEST_VERSION}`;

async function expectCanonicalShell(page, path, title) {
  await page.goto(`${baseUrl}/${path}`);
  await expect(page.locator('.paco-template-version-badge')).toHaveText(expectedVersionBadge);
  await expect(page.locator('.paco-template-hero')).toBeVisible();
  await expect(page.locator('.paco-template-sidebar')).toBeVisible();
  await expect(page.locator('.paco-template-main h1')).toHaveText(title);
  await expect(page.locator('.paco-template-nav-submenu')).toHaveCount(0);
}

test('dashboard page uses the canonical shell for a selected student', async ({ page }) => {
  await expectCanonicalShell(page, 'dashboard.html?student=Zyon', 'Dashboard');
  await expect(page.locator('.dashboard-page')).toBeVisible();
  await expect(page.locator('.dashboard-student')).toHaveCount(0);
  await expect(page.getByText('Andere leerling', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Jouw voortgang', { exact: true })).toHaveCount(0);
});

test('dashboard page owns the canonical student chooser', async ({ page }) => {
  await expectCanonicalShell(page, 'dashboard.html', 'Wie gaat er leren?');
  await expect(page.locator('.student-grid')).toBeVisible();
  await expect(page.locator('.student-card')).toHaveCount(3);
  await expect(page.locator('.student-card').nth(0)).toContainText('Zyon');
  await expect(page.locator('.student-card').nth(1)).toContainText('Zenith');
  await expect(page.locator('.student-card').nth(2)).toContainText('Zephon');
});

test('management page enforces the canonical authentication boundary', async ({ page }) => {
  await page.goto(`${baseUrl}/management.html`);
  await expect(page).toHaveURL(/\/auth\.html$/);
});

test('test page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'test.html', 'Toets');
  await expect(page.locator('#testProgress')).toHaveCount(1);
  await expect(page.locator('#testContent')).toHaveCount(1);
  await expect(page.locator('#result')).toHaveCount(1);
});

test('test history page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'test-history.html', 'Toetsgeschiedenis');
  await expect(page.locator('#historyStudent')).toHaveCount(1);
  await expect(page.locator('#testHistoryContent')).toHaveCount(1);
});

test('lesson view uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'lesson-view.html', 'Les bekijken');
});

test('questions page uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'questions.html', 'Vragen maken');
});
