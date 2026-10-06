import { test, expect } from '@playwright/test';

const baseURL = process.env.PACOGO_BROWSER_BASE_URL || 'http://127.0.0.1:4173';

async function openGuestAccess(page) {
  await page.goto(`${baseURL}/test/browser/lesson-guest-access-runtime.fixture.html`);
  await page.waitForFunction(() => typeof window.setGuestLesson === 'function');
  await page.evaluate(() => window.pacoGOLessonGuestAccessRuntimeReady);
}

test('V4.78 guest lesson activation executes through the browser facade and bootstrap', async ({ page }) => {
  await openGuestAccess(page);
  const result = await page.evaluate(async () => {
    const value = await window.setGuestLesson(42, true);
    return {
      value,
      events: window.__events.slice(),
      insert: window.__lastDbInsert,
      query: window.__lastDbQuery
    };
  });
  expect(result.value).toMatchObject({ ok: true, stage: 'complete', lessonId: 42, active: true, guestId: 7001 });
  expect(result.events).toEqual([
    'authorize',
    'render-parent-student',
    'message:success:Les geactiveerd.'
  ]);
  expect(result.query).toMatchObject({ table: 'guest_lessons', filters: [['guest_id', 7001], ['lesson_id', 42]] });
  expect(result.insert).toMatchObject({ table: 'guest_lessons', operation: 'insert', payload: { guest_id: 7001, lesson_id: 42, active: true } });
});

test('V4.78 guest lesson deactivation updates the existing assignment through the browser facade', async ({ page }) => {
  await openGuestAccess(page);
  const result = await page.evaluate(async () => {
    await window.setGuestLesson(42, true);
    window.__events.length = 0;
    const value = await window.setGuestLesson(42, false);
    return { value, events: window.__events.slice(), update: window.__lastDbUpdate };
  });
  expect(result.value).toMatchObject({ ok: true, stage: 'complete', lessonId: 42, active: false, guestId: 7001, assignmentId: 8001 });
  expect(result.events).toEqual([
    'authorize',
    'render-parent-student',
    'message:success:Les gedeactiveerd.'
  ]);
  expect(result.update).toMatchObject({ table: 'guest_lessons', operation: 'update', payload: { active: false }, filters: [['id', 8001]] });
});
