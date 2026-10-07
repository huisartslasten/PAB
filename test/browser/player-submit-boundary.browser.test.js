import { test, expect } from '@playwright/test';

test('browser DOM answer flows through canonical player engine and persists', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/test/browser/player-submit-boundary.fixture.html');

  await page.locator('#testAnswer').fill('fruit');
  const first = await page.evaluate(() => window.submitTest());
  expect(first.correct).toBe(true);
  expect(await page.evaluate(() => window.playerState())).toMatchObject({ index: 1 });

  await page.locator('#testContent').evaluate(el => {
    el.innerHTML = '<input id="testAnswer"><button class="big" type="button">Volgende</button>';
  });
  await page.locator('#testAnswer').fill('wrong');
  const second = await page.evaluate(() => window.submitTest());
  expect(second.correct).toBe(false);
  expect(await page.evaluate(() => window.playerState())).toMatchObject({ index: 2 });

  await page.evaluate(() => window.finishPlayerTest());

  expect(await page.evaluate(() => window.__events[0].attempt)).toMatchObject({
    lesson_id: 42,
    student: 'Zyon',
    score: 1,
    total_questions: 2,
    is_test: true
  });
  expect(await page.evaluate(() => window.__events[0].answers.map(x => x.is_correct))).toEqual([true, false]);
});
