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
  await expect(page).toHaveURL(/\/dashboard\.html\?viewStudent=Zyon&mode=student$/);
  await expect(page.locator('.paco-template-version-badge')).toHaveText(expectedVersionBadge);
  await expect(page.locator('.paco-template-main h1')).toHaveText('Dashboard');
  await expect(page.getByRole('button', { name: '← Terug' })).toBeVisible();
  await expect(page.getByRole('button', { name: /🏠 Dashboard/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /📚 Mijn vakken/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /⚙️ Beheer/ })).toHaveCount(0);
  await expect(page.getByText('Wat wil je leren?', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Actieve vakken voor Zyon\./)).toHaveCount(0);
  await expect(page.getByText('Binnenkort', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mijn vakken' })).toBeVisible();
});

test('dashboard Breuken card opens the formative diagnostic and preserves learner context', async ({ page }) => {
  await page.goto(`${baseUrl}/dashboard.html`, { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { createDashboardRuntime } = await import('/src/features/dashboard/runtime.js');
    const templateMount = document.createElement('div');
    const chooserMount = document.createElement('div');
    let navigatedTo = '';
    const app = {
      mapLessons: () => [],
      agenda: { buildAgendaItemsForRender: () => [] }
    };
    const runtime = createDashboardRuntime({
      app,
      templateMount,
      chooserMount,
      context: { student: 'Zyon', mode: 'student' },
      documentRef: document,
      navigate: target => { navigatedTo = String(target); }
    });
    runtime.render([]);
    const tile = [...runtime.content.querySelectorAll('.paco-tile')].find(item =>
      item.querySelector('.paco-tile-title')?.textContent === 'Breuken'
    );
    const label = tile.querySelector('.paco-tile-action')?.textContent || '';
    tile.querySelector('.paco-tile-action').click();
    return { label, navigatedTo };
  });
  expect(result.label).toBe('Start diagnose →');
  expect(result.navigatedTo).toContain('curriculum-fraction-diagnostic-learner.html');
  expect(result.navigatedTo).toContain('viewStudent=Zyon');
  expect(result.navigatedTo).toContain('mode=student');
});
