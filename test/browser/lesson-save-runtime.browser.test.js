import { test, expect } from '@playwright/test';

const baseURL = process.env.PACOGO_BROWSER_BASE_URL || 'http://127.0.0.1:4173';

test('V4.78 saveLesson executes through the classic facade and bootstrap in a real browser', async ({ page }) => {
  await page.goto(`${baseURL}/test/browser/lesson-save-runtime.fixture.html`);
  await page.waitForFunction(() => typeof window.saveLesson === 'function');
  await page.evaluate(() => window.pacoGOLessonSaveRuntimeReady);

  await page.evaluate(() => window.saveLesson());

  const result = await page.evaluate(() => ({
    currentSubject: window.currentSubject,
    currentLesson: window.currentLesson,
    createdLesson: window.__createdLesson,
    events: window.__events.slice()
  }));

  expect(result.currentSubject).toBe('Rekenen');
  expect(result.currentLesson).toBeNull();
  expect(result.createdLesson).toMatchObject({
    id: 9001,
    student: 'Browser Student',
    subject: 'Rekenen',
    subvak: 'Getallen',
    title: 'Browser proof',
    type: 'words'
  });
  expect(result.events).toEqual([
    'reload',
    'test-date:remove',
    'calendar',
    'sidebars',
    'message:success:Les opgeslagen.'
  ]);
});

test('V4.78 saveLesson still reaches validation through the browser facade', async ({ page }) => {
  await page.goto(`${baseURL}/test/browser/lesson-save-runtime.fixture.html`);
  await page.waitForFunction(() => typeof window.saveLesson === 'function');
  await page.evaluate(() => {
    document.querySelector('.word-q-part').value = '';
  });

  const result = await page.evaluate(async () => {
    const value = await window.saveLesson();
    return {
      value,
      error: document.getElementById('editorError').textContent,
      events: window.__events.slice()
    };
  });

  expect(result.value).toMatchObject({ ok: false, stage: 'validation' });
  expect(result.error).toBe('Vul het vak, de lestitel en minstens één item in.');
  expect(result.events).toEqual([]);
});
