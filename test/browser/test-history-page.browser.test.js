import { test, expect } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173';

async function installSupabaseFixture(page) {
  await page.addInitScript(() => {
    window.__historyEvents = [];
    const attempts = [
      {
        id: 1,
        student: 'Zyon',
        lesson_id: 11,
        score: 2,
        total_questions: 3,
        completed_at: '2026-10-18T09:00:00Z',
        test_attempt_answers: [
          { question_order: 1, question: '<script>alert(1)</script>', given_answer: '2', expected_answer: '2', is_correct: true },
          { question_order: 2, question: 'Breuken', given_answer: '1/2', expected_answer: '1/3', is_correct: false }
        ]
      },
      {
        id: 2,
        student: 'Zenith',
        lesson_id: 12,
        score: 1,
        total_questions: 1,
        completed_at: '2026-10-17T09:00:00Z',
        test_attempt_answers: [
          { question_order: 1, question: 'Themawoorden', given_answer: 'boom', expected_answer: 'boom', is_correct: true }
        ]
      }
    ];

    const lessons = [
      { id: 11, subject: 'Rekenen', title: 'Breuken', student: 'Zyon', archived: false, deleted: false },
      { id: 12, subject: 'Spelling', title: 'Themawoorden', student: 'Zenith', archived: false, deleted: false }
    ];

    function response(data = null, error = null) {
      return {
        data,
        error,
        select() { return this; },
        eq(column, value) {
          window.__historyEvents.push({ op: 'eq', table: this.__table, column, value });
          this.__eq = { column, value };
          return this;
        },
        order() { return this; },
        async then(resolve) {
          let result = data;
          if (this.__table === 'test_attempts' && this.__eq?.column === 'student') {
            result = attempts.filter(attempt => attempt.student === this.__eq.value);
          }
          resolve({ data: result, error });
        }
      };
    }

    window.supabase = {
      createClient() {
        return {
          from(table) {
            const query = response();
            query.__table = table;
            query.select = () => query;
            query.order = () => query;
            query.eq = (column, value) => {
              window.__historyEvents.push({ op: 'eq', table, column, value });
              query.__eq = { column, value };
              return query;
            };
            query.then = async resolve => {
              if (table === 'lessons') resolve({ data: lessons, error: null });
              else if (table === 'test_attempts') {
                if (query.__eq?.column === 'student') {
                  resolve({ data: attempts.filter(attempt => attempt.student === query.__eq.value), error: null });
                } else if (new URLSearchParams(window.location.search).get('error') === '1') {
                  resolve({ data: null, error: { message: 'test-history-db-error' } });
                } else {
                  resolve({ data: attempts, error: null });
                }
              } else resolve({ data: [], error: null });
            };
            return query;
          },
          auth: {
            async getSession() {
              return { data: { session: { user: { id: '00000000-0000-0000-0000-000000000001' } } }, error: null };
            },
            onAuthStateChange() {
              return { data: { subscription: { unsubscribe() {} } } };
            },
            async signOut() { return { error: null }; }
          }
        };
      }
    };
  });
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