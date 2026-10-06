import test from 'node:test';
import assert from 'node:assert/strict';
import { saveTestAttemptRuntime } from '../src/features/test-history/test-attempt-runtime.js';

function createDb() {
  const events = [];
  return {
    events,
    from(table) {
      return {
        insert(payload) {
          events.push([table, payload]);
          if (table === 'test_attempts') {
            return { select: () => ({ single: async () => ({ data: { id: 42 }, error: null }) }) };
          }
          return Promise.resolve({ error: null });
        }
      };
    }
  };
}

test('runtime delegates the student-owned test completion without parent authorization', async () => {
  const db = createDb();
  const result = await saveTestAttemptRuntime({
    db,
    currentStudent: 'Zyon',
    currentLesson: { id: 7, type: 'dictation' },
    attempt: {
      type: 'dictation',
      answers: [{ item: { question: 'appel', answer: 'appel' }, value: 'appel', correct: true }]
    }
  });

  assert.equal(result, undefined);
  assert.equal(db.events[0][0], 'test_attempts');
  assert.equal(db.events[1][0], 'test_attempt_answers');
});
