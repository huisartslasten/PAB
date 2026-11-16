import { test, expect } from '@playwright/test';

const baseURL = process.env.PACOGO_BROWSER_BASE_URL || 'http://127.0.0.1:4173';

async function openLessonOrderRuntime(page) {
  await page.goto(`${baseURL}/test/browser/lesson-order-runtime.fixture.html`);
  await page.evaluate(() => window.__runtimeReady);
  await page.waitForFunction(() => typeof window.pacoGOGetOrderedLessons === 'function');
}

test('lesson ordering uses remote order in Chromium and preserves deterministic fallback', async ({ page }) => {
  await openLessonOrderRuntime(page);
  const result = await page.evaluate(async () => {
    window.__remoteRows = [{ lesson_id: 3, position: 0 }, { lesson_id: 1, position: 1 }];
    const remote = await window.pacoGOGetOrderedLessons([{ id: 1 }, { id: 2 }, { id: 3 }], 'Zyon', 'Nederlands');

    window.__remoteRows = [];
    window.__local.set('pacogo-lesson-order-Zyon-Nederlands', '[2,1]');
    const local = await window.pacoGOGetOrderedLessons([{ id: 1 }, { id: 2 }, { id: 3 }], 'Zyon', 'Nederlands');

    return { remote: remote.map(x => x.id), local: local.map(x => x.id) };
  });

  expect(result).toEqual({ remote: [3, 1, 2], local: [2, 1, 3] });
});

test('lesson ordering persists local and remote order through the browser runtime', async ({ page }) => {
  await openLessonOrderRuntime(page);
  const result = await page.evaluate(async () => {
    await window.pacoGOSaveLessonOrder('Zyon', 'Nederlands', [{ id: 8 }, { id: 4 }]);
    return {
      local: window.__local.get('pacogo-lesson-order-Zyon-Nederlands'),
      calls: window.__calls
    };
  });

  expect(result.local).toBe('[8,4]');
  expect(result.calls.some(call => call.table === 'lesson_order' && call.op === 'delete')).toBe(true);
  expect(result.calls.some(call => call.table === 'lesson_order' && call.op === 'insert')).toBe(true);
});
