import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestHistoryReadService } from '../src/features/test-history/test-history-read-service.js';

function createMockDb({ data = [], error = null } = {}) {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push({ op: 'from', table });
      const builder = {
        select(columns) {
          calls.push({ op: 'select', columns });
          return builder;
        },
        order(column, options) {
          calls.push({ op: 'order', column, options });
          return builder;
        },
        eq(column, value) {
          calls.push({ op: 'eq', column, value });
          return builder;
        },
        then(resolve, reject) {
          return Promise.resolve({ data, error }).then(resolve, reject);
        }
      };
      return builder;
    }
  };
}

test('test history service preserves the V4.78 query shape and ordering', async () => {
  const attempts = [{ id: 10, student: 'Zyon' }];
  const db = createMockDb({ data: attempts });
  const service = createTestHistoryReadService(db);

  const result = await service.listAttempts();

  assert.deepEqual(result, attempts);
  assert.deepEqual(db.calls, [
    { op: 'from', table: 'test_attempts' },
    { op: 'select', columns: 'id,lesson_id,student,score,total_questions,started_at,completed_at,test_attempt_answers(id,question_order,question,expected_answer,given_answer,is_correct,question_type,answered_at)' },
    { op: 'order', column: 'completed_at', options: { ascending: false } }
  ]);
});

test('test history service filters by student when requested', async () => {
  const db = createMockDb({ data: [{ id: 11, student: 'Zenith' }] });
  const service = createTestHistoryReadService(db);

  await service.listAttempts('Zenith');

  assert.deepEqual(db.calls, [
    { op: 'from', table: 'test_attempts' },
    { op: 'select', columns: 'id,lesson_id,student,score,total_questions,started_at,completed_at,test_attempt_answers(id,question_order,question,expected_answer,given_answer,is_correct,question_type,answered_at)' },
    { op: 'order', column: 'completed_at', options: { ascending: false } },
    { op: 'eq', column: 'student', value: 'Zenith' }
  ]);
});

test('test history service propagates database errors', async () => {
  const error = new Error('history failed');
  const service = createTestHistoryReadService(createMockDb({ error }));

  await assert.rejects(() => service.listAttempts(), error);
});
