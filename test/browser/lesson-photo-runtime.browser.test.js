import { test, expect } from '@playwright/test';

const baseURL = process.env.PACOGO_BROWSER_BASE_URL || 'http://127.0.0.1:4173';

async function openPhotoRuntime(page) {
  await page.goto(`${baseURL}/test/browser/lesson-photo-runtime.fixture.html`);
  await page.waitForFunction(() => typeof window.createLessonFromPhoto === 'function');
  await page.evaluate(() => window.pacoGOLessonPhotoRuntimeReady);
}

test('V4.78 photo lesson creation executes through the browser facade and bootstrap', async ({ page }) => {
  await openPhotoRuntime(page);
  const result = await page.evaluate(async () => {
    const value = await window.createLessonFromPhoto({
      student: 'Zyon',
      subject: 'Themawoorden',
      title: 'Foto-les',
      type: 'words',
      pairs: [{ question: 'kat', answer: 'dier' }]
    });
    return {
      value,
      events: window.__events.slice(),
      insert: window.__lastDbInsert,
      state: {
        student: window.currentStudent,
        subject: window.currentSubject,
        lesson: window.currentLesson
      }
    };
  });

  expect(result.value).toMatchObject({ ok: true, stage: 'complete', lessonId: 42, student: 'Zyon', subject: 'Themawoorden', title: 'Foto-les', type: 'words' });
  expect(result.events).toEqual([
    'authorize',
    'load',
    'message:success:Les gemaakt uit de foto. Controleer hem gerust nog even.',
    'dashboard'
  ]);
  expect(result.state).toMatchObject({
    student: 'Zyon',
    subject: 'Themawoorden',
    lesson: { id: 42, title: 'Foto-les' }
  });
  expect(result.insert).toMatchObject({ table: 'lesson_items', operation: 'insert' });
});

test('V4.78 photo lesson creation rolls back the lesson when item insertion fails', async ({ page }) => {
  await openPhotoRuntime(page);
  const result = await page.evaluate(async () => {
    window.__failItemInsert = true;
    try {
      await window.createLessonFromPhoto({
        student: 'Zyon',
        subject: 'Rekenen',
        title: 'Foto',
        type: 'math',
        pairs: [{ question: '1+1', answer: '2' }]
      });
      return { failed: false };
    } catch (error) {
      return {
        failed: true,
        message: error?.message || String(error),
        delete: window.__lastDbDelete
      };
    }
  });

  expect(result.failed).toBe(true);
  expect(result.message).toBe('item insert failed');
  expect(result.delete).toMatchObject({ table: 'lessons', operation: 'delete', filters: [['id', 42]] });
});
