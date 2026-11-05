import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-b1-learner.html';

test('B1 learner practice accepts direct answers and records a session learning cycle', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto(pageUrl);
  await expect(page.locator('h1')).toHaveText('We gaan optellen');
  await expect(page.locator('#progress')).toContainText('Oefening 1 van 3');
  await expect(page.locator('.quantity-group')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Verder tellen' })).toHaveCount(0);
  await expect(page.locator('textarea')).toHaveCount(0);

  await page.locator('input[aria-label="Wat is de som?"]').fill('11');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('#feedback')).toContainText('Deze poging is ook verwerkt');
  await expect(page.locator('#sessionSummary')).toContainText('1 antwoord verwerkt');

  await page.getByRole('button', { name: 'Volgende oefening' }).click();
  await expect(page.locator('#progress')).toContainText('Oefening 2 van 3');
  await expect(page.locator('.addition-equation')).toHaveText('28 + 17 = ?');
  await page.locator('input[aria-label="Wat is de som?"]').fill('45');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('#feedback')).toContainText('Goed gedaan');
  await expect(page.locator('#sessionSummary')).toContainText('2 antwoorden verwerkt');

  await page.getByRole('button', { name: 'Volgende oefening' }).click();
  await expect(page.locator('#progress')).toContainText('Oefening 3 van 3');
  await expect(page.locator('.addition-equation')).toHaveText('46 + 28 = ?');
  await page.locator('input[aria-label="Wat is de som?"]').fill('74');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('#feedback')).toContainText('Goed gedaan');
  await expect(page.locator('#progress')).toHaveText('Oefenronde afgerond');
  await expect(page.locator('#sessionSummary')).toContainText('3 antwoorden verwerkt');
  expect(pageErrors).toEqual([]);
});
