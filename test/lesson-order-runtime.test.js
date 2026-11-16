import test from 'node:test';
import assert from 'node:assert/strict';
import { getOrderedLessonsRuntime, saveLessonOrderRuntime } from '../src/features/lessons/lesson-order-runtime.js';

test('getOrderedLessonsRuntime reads and applies persisted order', async () => {
  const calls = [];
  const list = [{ id: 1 }, { id: 2 }];
  const result = await getOrderedLessonsRuntime({
    list,
    student: 'Zyon',
    subject: 'Nederlands',
    readOrder: async (student, subject) => {
      calls.push(['read', student, subject]);
      return [2, 1];
    },
    applyOrder: (items, saved) => {
      calls.push(['apply', items, saved]);
      return [items[1], items[0]];
    }
  });

  assert.deepEqual(result, [{ id: 2 }, { id: 1 }]);
  assert.deepEqual(calls, [
    ['read', 'Zyon', 'Nederlands'],
    ['apply', list, [2, 1]]
  ]);
});

test('saveLessonOrderRuntime delegates once and returns canonical ids', async () => {
  const calls = [];
  const list = [{ id: 7 }, { id: 3 }];
  const result = await saveLessonOrderRuntime({
    student: 'Zyon',
    subject: 'Nederlands',
    list,
    persistRemote: false,
    writeOrder: async (...args) => calls.push(args)
  });

  assert.deepEqual(calls, [['Zyon', 'Nederlands', list, { persistRemote: false }]]);
  assert.deepEqual(result, { ok: true, ids: [7, 3] });
  assert.equal(Object.isFrozen(result), true);
});

test('runtime rejects missing order reader', async () => {
  await assert.rejects(
    () => getOrderedLessonsRuntime({ list: [] }),
    /lesson-order reader/i
  );
});

test('runtime rejects missing order writer', async () => {
  await assert.rejects(
    () => saveLessonOrderRuntime({ student: 'Zyon', subject: 'Nederlands', list: [] }),
    /lesson-order writer/i
  );
});
