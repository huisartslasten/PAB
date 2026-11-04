import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-fr2-fractions.html';

test('FR2 symbolic equivalence captures the required learner explanation through the curriculum engine', async ({ page }) => {
  await page.goto(pageUrl);
  await expect(page.locator('h1')).toHaveText('Welke breuk heeft dezelfde waarde?');

  const options = page.locator('.pacogo-fraction-interface__option');
  await expect(options).toHaveCount(3);
  await options.nth(1).click();

  const submit = page.getByRole('button', { name: 'Controleren' });
  await submit.click();
  await expect(page.locator('.pacogo-fraction-interface__status')).toHaveText('Vul eerst je uitleg in.');

  const explanation = '4/8 is gelijk aan 1/2, omdat teller en noemer met 4 zijn vermenigvuldigd.';
  await page.getByRole('textbox', { name: 'Leg uit waarom deze breuk dezelfde waarde heeft.' }).fill(explanation);
  await submit.click();

  await expect(page.locator('#status')).toContainText('Goed gekozen');
  const trace = JSON.parse(await page.locator('#trace').textContent());

  expect(trace.registry_version).toBe('0.2.0-seed');
  expect(trace.evidence_count).toBe(1);
  expect(trace.mastery.status).toBe('NOT YET MASTERED');
  expect(trace.interaction_event_count).toBeGreaterThanOrEqual(4);
  expect(trace.observation_id).toContain('obs:FR2-T02');
  expect(trace.explanation).toBe(explanation);
});
