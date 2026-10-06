import { test, expect } from '@playwright/test';

const fixtureUrl = 'http://127.0.0.1:4173/test/browser/lesson-load-runtime.fixture.html';

test('lesson load runtime bootstraps and preserves ordering in Chromium', async ({ page }) => {
  await page.goto(fixtureUrl);
  const result = JSON.parse(await page.locator('#status').textContent());
  expect(result).toEqual({
    ok: true,
    lessonCount: 1,
    itemOrder: [1, 2],
    homeCalls: 1,
    messages: [],
    installed: true
  });
});
