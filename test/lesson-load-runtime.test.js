import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLessonsRuntime } from '../src/features/lessons/lesson-load-runtime.js';

test('lesson loading stores loaded lessons and returns to home on success', async () => {
  const loaded = [{ id: 1, title: 'Rekenen' }];
  const state = { lessons: null, messages: [], homeCalls: 0 };

  const result = await loadLessonsRuntime({
    listLessons: async () => loaded,
    setLessons: value => { state.lessons = value; },
    showMessage: (text, type) => state.messages.push({ text, type }),
    showHome: () => { state.homeCalls += 1; }
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.lessons, loaded);
  assert.deepEqual(state.lessons, loaded);
  assert.equal(state.homeCalls, 1);
  assert.deepEqual(state.messages, []);
});

test('lesson loading preserves the V4.78 error message and does not navigate on failure', async () => {
  const state = { messages: [], homeCalls: 0, lessons: null };
  const error = new Error('database unavailable');

  const result = await loadLessonsRuntime({
    listLessons: async () => { throw error; },
    setLessons: value => { state.lessons = value; },
    showMessage: (text, type) => state.messages.push({ text, type }),
    showHome: () => { state.homeCalls += 1; }
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, error);
  assert.equal(state.lessons, null);
  assert.equal(state.homeCalls, 0);
  assert.deepEqual(state.messages, [{
    text: 'Lessen laden mislukt: database unavailable',
    type: 'error'
  }]);
});

test('lesson loading rejects an invalid runtime contract', async () => {
  await assert.rejects(
    () => loadLessonsRuntime({
      listLessons: async () => [],
      setLessons: null,
      showMessage: () => {},
      showHome: () => {}
    }),
    /A lesson-state setter is required\./
  );
});
