import { test, expect } from '@playwright/test';

const baseURL = process.env.PACOGO_BROWSER_BASE_URL || 'http://127.0.0.1:4173';
const parentId = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';

const lessons = [
  { id: 101, subject: 'Rekenen', title: 'Breuken', lesson_items: [] },
  { id: 102, subject: 'Spelling', title: 'Themawoorden', lesson_items: [] }
];

const attempts = [
  {
    id: 1,
    lesson_id: 101,
    student: 'Zyon',
    score: 1,
    total_questions: 2,
    completed_at: '2026-10-06T18:00:00.000Z',
    test_attempt_answers: [
      { id: 11, question_order: 1, question: '1/2 + 1/2', given_answer: '2', expected_answer: '1', is_correct: false, question_type: 'math', answered_at: '2026-10-06T18:00:00.000Z' },
      { id: 12, question_order: 2, question: '3/4 + 1/4', given_answer: '1', expected_answer: '1', is_correct: true, question_type: 'math', answered_at: '2026-10-06T18:01:00.000Z' }
    ]
  },
  {
    id: 2,
    lesson_id: 102,
    student: 'Zenith',
    score: 2,
    total_questions: 2,
    completed_at: '2026-10-07T18:00:00.000Z',
    test_attempt_answers: [
      { id: 21, question_order: 1, question: '<script>alert(1)</script>', given_answer: '<img>', expected_answer: 'woord', is_correct: false, question_type: 'words', answered_at: '2026-10-07T18:00:00.000Z' },
      { id: 22, question_order: 2, question: 'boom', given_answer: 'boom', expected_answer: 'boom', is_correct: true, question_type: 'words', answered_at: '2026-10-07T18:01:00.000Z' }
    ]
  }
];

async function installSupabaseFixture(page) {
  const fixture = JSON.stringify({ lessons, attempts, parentId });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: `
      const fixture = ${fixture};
      window.__historyEvents = [];
      window.supabase = {
        createClient() {
          return {
            auth: {
              async getSession() {
                return { data: { session: { user: { id: fixture.parentId } } }, error: null };
              }
            },
            functions: {
              async invoke() {
                return { data: null, error: null };
              }
            },
            from(table) {
              let filter = null;
              const query = {
                select() { return query; },
                order() { return query; },
                eq(column, value) {
                  filter = { column, value };
                  window.__historyEvents.push({ op: 'eq', table, column, value });
                  return query;
                },
                then(resolve, reject) {
                  try {
                    if (table === 'test_attempts' && new URLSearchParams(window.location.search).get('error') === '1') {
                      return Promise.resolve({ data: null, error: new Error('test-history-db-error') }).then(resolve, reject);
                    }
                    let data = table === 'lessons' ? fixture.lessons : fixture.attempts;
                    if (filter) data = data.filter(row => String(row[filter.column]) === String(filter.value));
                    return Promise.resolve({ data, error: null }).then(resolve, reject);
                  } catch (error) {
                    return Promise.reject(error).then(resolve, reject);
                  }
                }
              };
              return query;
            }
          };
        }
      };
    `
  }));
}

test('canonical test history loads real history data through the app boundary', async ({ page }) => {
  await installSupabaseFixture(page);
  await page.goto(`${baseURL}/test-history.html`);

  await expect(page.locator('.paco-template-main h1')).toHaveText('Toetsgeschiedenis');
  await expect(page.locator('#testHistoryContent .test-history-item')).toHaveCount(2);
  await expect(page.locator('#testHistoryContent')).toContainText('Rekenen');
  await expect(page.locator('#testHistoryContent')).toContainText('Breuken');
  await expect(page.locator('#testHistoryContent')).toContainText('Spelling');
  await expect(page.locator('#testHistoryContent')).toContainText('Themawoorden');

  const html = await page.locator('#testHistoryContent').innerHTML();
  expect(html).not.toContain('<script>alert(1)</script>');
  expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('canonical test history applies the student filter through the read service', async ({ page }) => {
  await installSupabaseFixture(page);
  await page.goto(`${baseURL}/test-history.html?student=Zyon`);

  await expect(page.locator('#testHistoryContent .test-history-item')).toHaveCount(1);
  await expect(page.locator('#testHistoryContent')).toContainText('Rekenen');
  await expect(page.locator('#testHistoryContent')).not.toContainText('Themawoorden');
  await expect.poll(() => page.evaluate(() => window.__historyEvents.filter(event => event.op === 'eq'))).toContainEqual({
    op: 'eq',
    table: 'test_attempts',
    column: 'student',
    value: 'Zyon'
  });
});

test('canonical test history renders the filtered empty state', async ({ page }) => {
  await installSupabaseFixture(page);
  await page.goto(`${baseURL}/test-history.html?student=Zephon`);

  await expect(page.locator('#testHistoryContent')).toContainText('Nog geen gemaakte toetsen voor Zephon.');
});

test('canonical test history renders the database error state', async ({ page }) => {
  await installSupabaseFixture(page);
  await page.goto(`${baseURL}/test-history.html?error=1`);

  await expect(page.locator('#testHistoryContent')).toContainText('De toetsgeschiedenis kon niet worden geladen.');
  await expect(page.locator('#testHistoryContent')).toContainText('test-history-db-error');
});
