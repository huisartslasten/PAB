import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

test('bee reading exercise uses the central page template and completes all ten questions', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(baseUrl + '/reading-comprehension-bees.html?student=Zyon');
  await expect(page.locator('.paco-template-version-badge')).toHaveText('V7.0');
  await expect(page.locator('.paco-template-main h1')).toHaveText('Begrijpend lezen');
  await expect(page.locator('.paco-template-greeting')).toHaveText('Hoi, Zyon!');
  await expect(page.locator('#readingText h2')).toHaveText('Bijen: belangrijke werkers van onze natuur');
  await expect(page.locator('#readingText .reading-comprehension-text-section')).toHaveCount(7);
  await expect(page.locator('#readingText figure')).toHaveCount(4);
  await expect(page.locator('#readingText img')).toHaveCount(4);
  await expect(page.locator('#readingText img').nth(0)).toHaveAttribute('alt', /honingbij/i);
  await expect(page.locator('#readingText img').nth(3)).toHaveAttribute('alt', /bijenhotel/i);
  const correctAnswers = ['B','C','B','B','C','A','B','C'];
  for (let index = 0; index < 8; index += 1) {
    const question = page.locator('.reading-comprehension-question');
    await question.locator('input[name="reading-option"][value="' + correctAnswers[index] + '"]').check();
    await question.getByRole('button', { name: 'Controleren' }).click();
    await expect(question.locator('[data-feedback-state="correct"]')).toBeVisible();
    await question.getByRole('button', { name: 'Volgende vraag' }).click();
  }
  for (let index = 0; index < 2; index += 1) {
    const question = page.locator('.reading-comprehension-question');
    await question.locator('textarea').fill('Ik heb de belangrijkste informatie uit de tekst gebruikt en mijn antwoord onderbouwd.');
    await question.getByRole('button', { name: 'Vergelijk met voorbeeldantwoord' }).click();
    await expect(question.locator('.reading-comprehension-model-answer')).toBeVisible();
    await expect(question.locator('.reading-comprehension-criterion')).toHaveCount(3);
    const criteria = question.locator('.reading-comprehension-criterion input');
    for (let criterionIndex = 0; criterionIndex < 3; criterionIndex += 1) await criteria.nth(criterionIndex).check();
    await expect(criteria.nth(0)).toBeChecked();
    await expect(criteria.nth(1)).toBeChecked();
    await expect(criteria.nth(2)).toBeChecked();
    await question.getByRole('button', { name: index === 1 ? 'Bekijk resultaat' : 'Volgende vraag' }).click();
  }
  await expect(page.locator('#readingResults')).toBeVisible();
  await expect(page.locator('#readingResults')).toContainText('Meerkeuzevragen: 8 van 8 goed');
  await expect(page.locator('#readingResults')).toContainText('Open vragen: 6 van 6 punten');
  expect(pageErrors).toEqual([]);
});
