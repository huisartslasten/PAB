import test from 'node:test';
import assert from 'node:assert/strict';
import { executeLoadLessons, installLessonLoadRuntimeEntry } from '../src/features/lessons/lesson-load-runtime-entry.js';

function runtime(overrides = {}) {
  return {
    db: { from() {} },
    setLessons() {},
    showMessage() {},
    showHome() {},
    ...overrides
  };
}

test('lesson load entry installs a runtime facade on the target', () => {
  const target = {};
  const installed = installLessonLoadRuntimeEntry(runtime(), target);
  assert.equal(installed, target.loadLessonsRuntime);
  assert.equal(typeof installed, 'function');
});

test('lesson load entry rejects a missing bridge key', () => {
  const value = runtime();
  delete value.showHome;
  assert.throws(
    () => installLessonLoadRuntimeEntry(value, {}),
    /The lesson-load runtime bridge is missing: showHome\./
  );
});

test('lesson load entry delegates to the lesson service and runtime', async () => {
  const calls = [];
  const db = {
    from(table) {
      calls.push(['from', table]);
      return {
        select(columns) {
          calls.push(['select', columns]);
          return {
            order(column, options) {
              calls.push(['order', column, options]);
              return Promise.resolve({
                data: [{ id: 4, lesson_items: [{ id: 2, sort_order: 2 }, { id: 1, sort_order: 1 }] }],
                error: null
              });
            }
          };
        }
      };
    }
  };
  const state = { lessons: null, home: 0, messages: [] };
  const result = await executeLoadLessons({
    db,
    setLessons(value) { state.lessons = value; },
    showMessage(...args) { state.messages.push(args); },
    showHome() { state.home += 1; }
  });

  assert.equal(result.ok, true);
  assert.deepEqual(state.lessons[0].lesson_items.map(item => item.id), [1, 2]);
  assert.equal(state.home, 1);
  assert.deepEqual(state.messages, []);
  assert.deepEqual(calls, [
    ['from', 'lessons'],
    ['select', '*, lesson_items(*)'],
    ['order', 'id', { ascending: true }]
  ]);
});
