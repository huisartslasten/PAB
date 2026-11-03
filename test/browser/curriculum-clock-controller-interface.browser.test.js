import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-clock-controller-interface.html';

test('Clock analog source is read and answered through digital input', async ({ page }) => {
  await page.goto(pageUrl);
  const face = page.locator('.pacogo-clock__face');
  await expect(face).toHaveAttribute('aria-label', 'Analoge klok: 08:35');
  await expect(page.locator('.pacogo-clock__digital')).toHaveText('--:--');
  await expect(page.locator('.pacogo-clock__controls')).toBeVisible();

  await page.locator('.pacogo-clock__hour').fill('8');
  await page.locator('.pacogo-clock__minute').fill('35');
  await page.getByRole('button', { name: 'Zet tijd' }).click();

  await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:35');
  await page.getByRole('button', { name: 'Controleer antwoord' }).click();
  await expect(page.locator('#status')).toContainText('Goed');

  const trace = JSON.parse(await page.locator('#trace').textContent());
  expect(trace.task_type).toBe('read_analog_time');
  expect(trace.correctness).toBe(true);
  expect(trace.representation).toBe('digital_time');
  expect(trace.event_count).toBeGreaterThanOrEqual(3);
});

test('Clock digital source is set and answered through analog hand interaction', async ({ page }) => {
  await page.goto(`${pageUrl}?mode=digital_to_analog`);
  const face = page.locator('.pacogo-clock__face');
  await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:35');
  await expect(face).toHaveAttribute('aria-label', 'Analoge klok: 08:00');
  await expect(page.locator('.pacogo-clock__controls')).toBeHidden();

  const faceBox = await face.boundingBox();
  const minuteHandBox = await page.locator('[data-hand="minute"]').boundingBox();
  if (!faceBox || !minuteHandBox) throw new Error('Clock face or minute hand is not visible');

  const start = {
    x: minuteHandBox.x + minuteHandBox.width / 2,
    y: minuteHandBox.y + minuteHandBox.height / 2
  };
  const angle = 210 * Math.PI / 180;
  const radius = faceBox.width * 0.32;
  const target = {
    x: faceBox.x + faceBox.width / 2 + Math.sin(angle) * radius,
    y: faceBox.y + faceBox.height / 2 - Math.cos(angle) * radius
  };

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 8 });
  await page.mouse.up();

  await expect(face).toHaveAttribute('aria-label', 'Analoge klok: 08:35');
  await page.getByRole('button', { name: 'Controleer antwoord' }).click();
  await expect(page.locator('#status')).toContainText('Goed');

  const trace = JSON.parse(await page.locator('#trace').textContent());
  expect(trace.task_type).toBe('set_analog_clock');
  expect(trace.correctness).toBe(true);
  expect(trace.representation).toBe('analog_time');
  expect(trace.event_count).toBeGreaterThanOrEqual(3);
});

test('Clock representation matching selects and records the equivalent digital time', async ({ page }) => {
  await page.goto(`${pageUrl}?mode=match_representations`);
  const face = page.locator('.pacogo-clock__face');
  await expect(face).toHaveAttribute('aria-label', 'Analoge klok: 08:35');
  await expect(page.locator('.pacogo-clock__options')).toBeVisible();
  await expect(page.locator('.pacogo-clock__option')).toHaveCount(3);

  const correctOption = page.locator('.pacogo-clock__option[data-option-id="option-b"]');
  await correctOption.click();
  await expect(correctOption).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Controleer antwoord' }).click();
  await expect(page.locator('#status')).toContainText('Goed');

  const trace = JSON.parse(await page.locator('#trace').textContent());
  expect(trace.task_type).toBe('match_representations');
  expect(trace.correctness).toBe(true);
  expect(trace.representation).toBe('representation_choice');
  expect(trace.selected_option_id).toBe('option-b');
  expect(trace.event_count).toBeGreaterThanOrEqual(3);
});

test('Clock representation matching preserves an incorrect selection as incorrect evidence', async ({ page }) => {
  await page.goto(`${pageUrl}?mode=match_representations`);
  await page.locator('.pacogo-clock__option[data-option-id="option-a"]').click();
  await page.getByRole('button', { name: 'Controleer antwoord' }).click();
  await expect(page.locator('#status')).toContainText('Nog niet goed');

  const trace = JSON.parse(await page.locator('#trace').textContent());
  expect(trace.task_type).toBe('match_representations');
  expect(trace.correctness).toBe(false);
  expect(trace.selected_option_id).toBe('option-a');
});
