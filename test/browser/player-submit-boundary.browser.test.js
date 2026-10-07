import { test, expect } from '@playwright/test';

test('browser runtime entry owns render-submit-finish-persist-result flow', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/test/browser/player-submit-boundary.fixture.html');

  expect(await page.locator('#testAnswer').getAttribute('data-question-id')).toBe('1');
  await page.locator('#testAnswer').fill('fruit');
  const first = await page.evaluate(() => window.submitTest());
  expect(first.correct).toBe(true);
  expect(await page.evaluate(() => window.playerState())).toMatchObject({ index: 1 });
  expect(await page.locator('#testAnswer').getAttribute('data-question-id')).toBe('2');

  await page.locator('#testAnswer').fill('boom');
  const second = await page.evaluate(() => window.submitTest());

  expect(second.result.score).toBe(100);
  expect(await page.evaluate(() => window.playerState())).toMatchObject({ index: 2 });
  expect(await page.evaluate(() => window.__events[0].attempt)).toMatchObject({
    lesson_id: 42,
    student: 'Zyon',
    score: 2,
    total_questions: 2,
    is_test: true
  });
  expect(await page.evaluate(() => window.__events[0].answers.map(x => x.is_correct))).toEqual([true, true]);
  expect(await page.evaluate(() => window.__result.result.score)).toBe(100);
});
