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
  await expect(page.locator('.paco-template-nav-submenu')).toHaveCount(1);
  await expect(page.locator('.paco-template-nav-subitem')).toHaveText(['Agenda invoeren', 'Maandkalender']);
}

test('lessons uses the canonical shell', async ({ page }) => {
  await expectCanonicalShell(page, 'lessons.html', 'Mijn vakken');
  await expect(page.locator('.paco-template-nav-item').filter({ hasText: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn vakken' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toetsen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn agenda' })).toBeVisible();
});

test('lessons dashboard navigation targets the canonical dashboard', async ({ page }) => {
  await page.goto(`${baseUrl}/lessons.html?student=Zyon`);
  await page.locator('.paco-template-nav-item').filter({ hasText: 'Dashboard' }).click();
  await expect(page).toHaveURL(/\/dashboard\.html\?viewStudent=Zyon&mode=student$/);
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
  await expect(page.getByRole('button', { name: 'Mijn vakken' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toetsen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn agenda' })).toBeVisible();
});

test('flashcards uses the canonical shell without a dead oefenen navigation entry', async ({ page }) => {
  await expectCanonicalShell(page, 'flashcards-template.html', 'Flashcards');
  await expect(page.locator('.paco-template-nav-item').filter({ hasText: 'Oefenen' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mijn vakken' })).toBeVisible();
});

test('agenda uses the canonical shell and renders its owned week view', async ({ page }) => {
  await expectCanonicalShell(page, 'agenda.html?student=Zyon', 'Agenda');
  await expect(page.locator('[data-agenda-content]')).toBeVisible();
  await expect(page.locator('[data-agenda-content] .agenda-school-week')).toBeVisible();
  await expect(page.locator('[data-agenda-content] .agenda-week-day')).toHaveCount(7);
});
