import { test, expect } from '@playwright/test';

test('browser facade persists a completed test attempt through the refactored runtime', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/test/browser/test-attempt-runtime.fixture.html');
  await page.waitForFunction(() => window.pacoGOTestAttemptRuntimeReady);
  await page.evaluate(async () => window.saveTestAttempt({
    type: 'words',
    startedAt: '2026-10-06T20:00:00.000Z',
    answers: [
      { item: { question: 'appel', answer: 'fruit' }, value: 'fruit', correct: true },
      { item: { question: 'peer', answer: 'boom' }, value: 'fruit', correct: false }
    ]
  }));

  expect(await page.evaluate(() => __events.map(entry => entry.table))).toEqual([
    'test_attempts',
    'test_attempt_answers'
  ]);
  expect(await page.evaluate(() => __events[0].payload)).toMatchObject({
    lesson_id: 42,
    student: 'Zyon',
    score: 1,
    total_questions: 2,
    is_test: true
  });
});
