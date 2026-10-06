import { test, expect } from '@playwright/test';

const baseURL = process.env.PACOGO_BROWSER_BASE_URL || 'http://127.0.0.1:4173';

async function openRecovery(page) {
  await page.goto(`${baseURL}/test/browser/lesson-recovery-runtime.fixture.html`);
  await page.waitForFunction(() => typeof window.confirmDeleteLesson === 'function');
  await page.evaluate(() => window.pacoGOLessonRecoveryRuntimeReady);
}

test('V4.78 delete recovery executes through the browser facade and bootstrap', async ({ page }) => {
  await openRecovery(page);
  const result = await page.evaluate(async () => {
    const value = await window.confirmDeleteLesson();
    return { value, events: window.__events.slice(), update: window.__lastDbUpdate };
  });
  expect(result.value).toMatchObject({ ok: true, stage: 'complete', lessonId: 9001, subject: 'Rekenen' });
  expect(result.events).toEqual([
    'authorize', 'close-delete', 'reload', 'show-subject:Rekenen',
    'message:success:Les naar de prullenbak verplaatst.'
  ]);
  expect(result.update).toMatchObject({ table: 'lessons', patch: { deleted: true, archived: false }, id: ['id', 9001] });
});

test('V4.78 archive recovery executes through the browser facade and bootstrap', async ({ page }) => {
  await openRecovery(page);
  const result = await page.evaluate(async () => {
    const value = await window.confirmArchiveLesson();
    return { value, events: window.__events.slice(), update: window.__lastDbUpdate };
  });
  expect(result.value).toMatchObject({ ok: true, stage: 'complete', lessonId: 9001, subject: 'Rekenen' });
  expect(result.events).toEqual([
    'authorize', 'close-archive', 'reload', 'show-parent-dashboard',
    'message:success:Les gearchiveerd.'
  ]);
  expect(result.update).toMatchObject({ table: 'lessons', patch: { archived: true }, id: ['id', 9001] });
});

test('V4.78 archived restore executes through the browser facade and bootstrap', async ({ page }) => {
  await openRecovery(page);
  const result = await page.evaluate(async () => {
    const value = await window.restoreArchivedLesson('9001');
    return { value, events: window.__events.slice(), update: window.__lastDbUpdate, student: window.currentStudent };
  });
  expect(result.value).toMatchObject({ ok: true, stage: 'complete', lessonId: 9001, student: 'Browser Student' });
  expect(result.student).toBe('Browser Student');
  expect(result.events).toEqual([
    'authorize', 'reload', 'render-parent-dashboard',
    'message:success:Les teruggezet.'
  ]);
  expect(result.update).toMatchObject({ table: 'lessons', patch: { deleted: false, archived: false }, id: ['id', 9001] });
});

test('V4.78 deleted restore executes through the browser facade and bootstrap', async ({ page }) => {
  await openRecovery(page);
  const result = await page.evaluate(async () => {
    const value = await window.restoreDeletedLesson('9001');
    return { value, events: window.__events.slice(), update: window.__lastDbUpdate };
  });
  expect(result.value).toMatchObject({ ok: true, stage: 'complete', lessonId: 9001 });
  expect(result.events).toEqual([
    'authorize', 'reload',
    'message:success:Les uit de prullenbak hersteld.'
  ]);
  expect(result.update).toMatchObject({ table: 'lessons', patch: { deleted: false, archived: false }, id: ['id', 9001] });
});
