import test from 'node:test';
import assert from 'node:assert/strict';
import { executeSaveTestAttempt, installTestAttemptRuntimeEntry } from '../src/features/test-history/test-attempt-runtime-entry.js';

function createDb() {
  const calls = [];
  return {
    calls,
    from(table) {
      return {
        insert(payload) {
          calls.push({ table, payload });
          if (table === 'test_attempts') return { select: () => ({ single: async () => ({ data: { id: 9 }, error: null }) }) };
          return Promise.resolve({ error: null });
        }
      };
    }
  };
}

test('entry maps live runtime state into the test-attempt runtime', async () => {
  const db = createDb();
  const runtime = { db, currentStudent: 'Zyon', currentLesson: { id: 12, type: 'words' } };
  const result = await executeSaveTestAttempt(runtime, { type: 'words', answers: [{ item: { question: 'q', answer: 'a' }, value: 'a', correct: true }] });
  assert.equal(result.attemptId, 9);
  assert.equal(db.calls[0].payload.lesson_id, 12);
  assert.equal(db.calls[0].payload.student, 'Zyon');
});

test('entry installs a single public saveTestAttempt handler', async () => {
  const db = createDb();
  const target = {};
  const handler = installTestAttemptRuntimeEntry({ db, currentStudent: 'Zenith', currentLesson: { id: 13, type: 'words' } }, target);
  assert.equal(target.saveTestAttempt, handler);
  const result = await target.saveTestAttempt({ type: 'words', answers: [{ item: { question: 'q', answer: 'a' }, value: 'a', correct: true }] });
  assert.equal(result.attemptId, 9);
});
