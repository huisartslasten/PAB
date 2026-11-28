import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

test('moon origin reading exercise uses the central page template and completes four short questions', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(baseUrl + '/reading-comprehension-moon-origin.html?student=Zyon');
  await expect(page.locator('.paco-template-version-badge')).toHaveText('V7.0');
  await expect(page.locator('.paco-template-main h1')).toHaveText('Begrijpend lezen');
  await expect(page.locator('.paco-template-greeting')).toHaveText('Hoi, Zyon!');
  await expect(page.locator('.paco-template-page-header p')).toHaveText('Groep 8 · De ruimte');
  await expect(page.locator('.reading-comprehension-intro')).toContainText('DE RUIMTE');
  await expect(page.locator('.reading-comprehension-intro')).toContainText('KORT');
  await expect(page.locator('.reading-comprehension-toolbar')).toBeVisible();
  await expect(page.locator('.reading-comprehension-print-version .reading-comprehension-print-question')).toHaveCount(4);
  await expect(page.locator('#readingText h2')).toHaveText('De ruimte – Hoe is de maan ontstaan?');
  await expect(page.locator('#readingText .reading-comprehension-text-section')).toHaveCount(5);
  await expect(page.locator('#readingText figure')).toHaveCount(0);
  await expect(page.locator('#readingText .reading-comprehension-sources-list')).toHaveCount(1);
  await expect(page.locator('#readingText .reading-comprehension-sources-list a')).toHaveCount(4);
  await expect(page.locator('#readingText .reading-comprehension-text-section:not(.reading-comprehension-sources) a')).toHaveCount(0);
  const correctAnswers = ['A', 'B', 'A', 'C'];
  for (let index = 0; index < correctAnswers.length; index += 1) {
    const question = page.locator('.reading-comprehension-question');
    await question.locator('input[name="reading-option"][value="' + correctAnswers[index] + '"]').check();
    await question.getByRole('button', { name: 'Controleren' }).click();
    await expect(question.locator('[data-feedback-state="correct"]')).toBeVisible();
    await question.getByRole('button', { name: index === correctAnswers.length - 1 ? 'Bekijk resultaat' : 'Volgende vraag' }).click();
  }
  await expect(page.locator('#readingResults')).toBeVisible();
  await expect(page.locator('#readingResults')).toContainText('Meerkeuzevragen: 4 van 4 goed');
  expect(pageErrors).toEqual([]);
});
