import test from 'node:test';
import assert from 'node:assert/strict';
import { executeShowTestHistory, installTestHistoryRuntimeEntry } from '../src/features/test-history/test-history-runtime-entry.js';

function runtime(overrides = {}) {
  return {
    db: { from() {} },
    requireParent() { return true; },
    hideAll() {},
    showPage() {},
    setGreeting() {},
    setLoading() {},
    refreshSidebars() {},
    renderAttempts() {},
    renderError() {},
    ...overrides
  };
}

test('test history entry installs a runtime facade on the target', () => {
  const target = {};
  const installed = installTestHistoryRuntimeEntry(runtime(), target);
  assert.equal(installed, target.showTestHistoryRuntime);
  assert.equal(typeof installed, 'function');
});

test('test history entry rejects a missing bridge key', () => {
  const value = runtime();
  delete value.renderAttempts;
  assert.throws(
    () => installTestHistoryRuntimeEntry(value, {}),
    /The test-history runtime bridge is missing: renderAttempts\./
  );
});

test('test history entry executes the read service through the runtime contract', async () => {
  const calls = [];
  const db = {
    from(table) {
      calls.push(['from', table]);
      const builder = {
        select(columns) {
          calls.push(['select', columns]);
          return builder;
        },
        order(column, options) {
          calls.push(['order', column, options]);
          return builder;
        },
        eq(column, value) {
          calls.push(['eq', column, value]);
          return builder;
        },
        then(resolve, reject) {
          return Promise.resolve({ data: [{ id: 4, student: 'Zyon' }], error: null }).then(resolve, reject);
        }
      };
      return builder;
    }
  };
  const state = { rendered: null, page: 0 };
  const result = await executeShowTestHistory(runtime({
    db,
    hideAll() {},
    showPage() { state.page += 1; },
    renderAttempts(value) { state.rendered = value; }
  }), 'Zyon');

  assert.equal(result.ok, true);
  assert.deepEqual(state.rendered, [{ id: 4, student: 'Zyon' }]);
  assert.equal(state.page, 1);
  assert.deepEqual(calls, [
    ['from', 'test_attempts'],
    ['select', 'id,lesson_id,student,score,total_questions,started_at,completed_at,test_attempt_answers(id,question_order,question,expected_answer,given_answer,is_correct,question_type,answered_at)'],
    ['order', 'completed_at', { ascending: false }],
    ['eq', 'student', 'Zyon']
  ]);
});
