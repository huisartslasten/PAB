import { test, expect } from '@playwright/test';

const baseURL = process.env.PACOGO_BROWSER_BASE_URL || 'http://127.0.0.1:4173';

async function openHistory(page) {
  await page.goto(`${baseURL}/test/browser/test-history-runtime.fixture.html`);
  await page.waitForFunction(() => window.pacoGOTestHistoryRuntimeReady);
  await page.waitForFunction(() => typeof window.showTestHistoryRuntime === 'function');
}

const rows = [
  {
    id: 1,
    lesson_id: 101,
    student: 'Zyon',
    score: 1,
    total_questions: 2,
    completed_at: '2026-10-06T18:00:00.000Z',
    test_attempt_answers: [
      { question_order: 2, question: '3/4 + 1/4', given_answer: '1', expected_answer: '1', is_correct: true },
      { question_order: 1, question: '1/2 + 1/2', given_answer: '2', expected_answer: '1', is_correct: false }
    ]
  },
  {
    id: 2,
    lesson_id: 102,
    student: 'Zyon',
    score: 5,
    total_questions: 5,
    completed_at: '2026-10-07T18:00:00.000Z',
    test_attempt_answers: [
      { question_order: 1, question: '<script>alert(1)</script>', given_answer: '<img>', expected_answer: 'woord', is_correct: false }
    ]
  }
];

test('test history renders the real browser runtime and visible history', async ({ page }) => {
  await openHistory(page);
  const result = await page.evaluate(async data => {
    window.__historyRows = data;
    return window.showTestHistoryRuntime();
  }, rows);

  expect(result.ok).toBe(true);
  await expect(page.locator('#testHistoryContent .test-history-item')).toHaveCount(2);
  await expect(page.locator('#testHistoryContent')).toContainText('Rekenen — Breuken');
  await expect(page.locator('#testHistoryContent')).toContainText('Spelling — Themawoorden');
  await expect(page.locator('#testHistoryContent')).toContainText('5 goed');
  await expect(page.locator('#testHistoryContent')).toContainText('1 goed');

  const html = await page.locator('#testHistoryContent').innerHTML();
  expect(html).not.toContain('<script>alert(1)</script>');
  expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('test history applies the student filter at the database boundary', async ({ page }) => {
  await openHistory(page);
  await page.evaluate(() => {
    window.__historyRows = [];
    window.__events = [];
  });

  const result = await page.evaluate(() => window.showTestHistoryRuntime('Zyon'));
  expect(result.ok).toBe(true);
  expect(await page.evaluate(() => __events.filter(event => event.op === 'eq'))).toEqual([
    { op: 'eq', column: 'student', value: 'Zyon' }
  ]);
});

test('test history renders the empty state for a filtered student', async ({ page }) => {
  await openHistory(page);
  await page.evaluate(() => { window.__historyRows = []; });

  const result = await page.evaluate(() => window.showTestHistoryRuntime('Zyon'));
  expect(result.ok).toBe(true);
  await expect(page.locator('#testHistoryContent')).toContainText('Nog geen gemaakte toetsen voor Zyon.');
});

test('test history renders the error state when the database fails', async ({ page }) => {
  await openHistory(page);
  await page.evaluate(() => { window.__historyError = new Error('test-history-db-error'); });

  const result = await page.evaluate(() => window.showTestHistoryRuntime());
  expect(result.ok).toBe(false);
  await expect(page.locator('#testHistoryContent')).toContainText('De toetsgeschiedenis kon niet worden geladen.');
});
