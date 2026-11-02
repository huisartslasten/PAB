import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-a1-numberline.html';

test('A1 number-line vertical slice carries browser interaction into the curriculum engine', async ({ page }) => {
  await page.goto(pageUrl);
  await expect(page.locator('h1')).toHaveText('Zet het getal op de juiste plek');

  const line = page.locator('.pacogo-number-line');
  const box = await line.boundingBox();
  if (!box) throw new Error('number line is not visible');

  const x = box.x + box.width * 0.676;
  const y = box.y + box.height * 0.5;
  await page.mouse.click(x, y);
  await page.getByRole('button', { name: 'Controleren' }).click();

  await expect(page.locator('#status')).toContainText('Goed geplaatst');
  const trace = JSON.parse(await page.locator('#trace').textContent());

  expect(trace.registry_version).toBe('0.2.0-seed');
  expect(trace.evidence_count).toBe(1);
  expect(trace.mastery.status).toBe('NOT YET MASTERED');
  expect(trace.interaction_event_count).toBeGreaterThanOrEqual(2);
  expect(trace.observation_id).toContain('obs:A1-T01');
});
