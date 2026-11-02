import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-fr2-fractions.html';

test('FR2 fraction equivalence reuses the interaction contract through the curriculum engine', async ({ page }) => {
  await page.goto(pageUrl);
  await expect(page.locator('h1')).toHaveText('Welke breuk heeft dezelfde waarde?');

  const options = page.locator('.option');
  await expect(options).toHaveCount(3);
  await options.nth(1).click();
  await page.getByRole('button', { name: 'Controleren' }).click();

  await expect(page.locator('#status')).toContainText('Goed');
  const trace = JSON.parse(await page.locator('#trace').textContent());

  expect(trace.registry_version).toBe('0.2.0-seed');
  expect(trace.evidence_count).toBe(1);
  expect(trace.mastery.status).toBe('NOT YET MASTERED');
  expect(trace.interaction_event_count).toBeGreaterThanOrEqual(3);
  expect(trace.observation_id).toContain('obs:FR2-T02');
});
