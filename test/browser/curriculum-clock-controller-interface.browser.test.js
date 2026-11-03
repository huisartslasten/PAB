import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-clock-controller-interface.html';

test('Clock analog hand interaction reaches the controller and creates evidence', async ({ page }) => {
  await page.goto(pageUrl);
  const face = page.locator('.pacogo-clock__face');
  await expect(face).toBeVisible();
  await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:00');

  await page.getByRole('button', { name: 'Analoog' }).click();
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

  await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:35');
  await page.getByRole('button', { name: 'Controleer tijd' }).click();
  await expect(page.locator('#status')).toContainText('Goed');

  const trace = JSON.parse(await page.locator('#trace').textContent());
  expect(trace.correctness).toBe(true);
  expect(trace.representation).toBe('analog_time');
  expect(trace.event_count).toBeGreaterThanOrEqual(3);
});

test('Clock digital time setting reaches the controller and creates evidence', async ({ page }) => {
  await page.goto(pageUrl);
  await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:00');

  await page.locator('.pacogo-clock__hour').fill('8');
  await page.locator('.pacogo-clock__minute').fill('35');
  await page.getByRole('button', { name: 'Zet tijd' }).click();

  await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:35');
  await page.getByRole('button', { name: 'Controleer tijd' }).click();
  await expect(page.locator('#status')).toContainText('Goed');

  const trace = JSON.parse(await page.locator('#trace').textContent());
  expect(trace.correctness).toBe(true);
  expect(trace.representation).toBe('digital_time');
  expect(trace.event_count).toBeGreaterThanOrEqual(3);
});
