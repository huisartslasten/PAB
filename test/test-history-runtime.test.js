import test from 'node:test';
import assert from 'node:assert/strict';
import { showTestHistoryRuntime } from '../src/features/test-history/test-history-runtime.js';

function createRuntime(overrides = {}) {
  const calls = [];
  return {
    calls,
    requireParent: () => { calls.push('requireParent'); return true; },
    hideAll: () => calls.push('hideAll'),
    showPage: () => calls.push('showPage'),
    setGreeting: value => calls.push(['setGreeting', value]),
    setLoading: () => calls.push('setLoading'),
    refreshSidebars: () => calls.push('refreshSidebars'),
    listAttempts: async student => { calls.push(['listAttempts', student]); return [{ id: 1 }]; },
    renderAttempts: (data, student) => calls.push(['renderAttempts', data, student]),
    renderError: error => calls.push(['renderError', error.message]),
    ...overrides
  };
}

test('test history runtime preserves the V4.78 page lifecycle and student filter', async () => {
  const runtime = createRuntime();
  const result = await showTestHistoryRuntime({ ...runtime, studentFilter: 'Zyon' });

  assert.equal(result.ok, true);
  assert.deepEqual(runtime.calls, [
    'requireParent',
    'hideAll',
    ['setGreeting', 'Zyon'],
    'setLoading',
    'showPage',
    'refreshSidebars',
    ['listAttempts', 'Zyon'],
    ['renderAttempts', [{ id: 1 }], 'Zyon']
  ]);
});

test('test history runtime reports query errors without throwing', async () => {
  const error = new Error('history failed');
  const runtime = createRuntime({ listAttempts: async () => { throw error; } });

  const result = await showTestHistoryRuntime({ ...runtime, studentFilter: '' });

  assert.equal(result.ok, false);
  assert.equal(result.error, error);
  assert.deepEqual(runtime.calls.slice(-2), [
    'refreshSidebars',
    ['renderError', 'history failed']
  ]);
});

test('test history runtime does not navigate when parent access is denied', async () => {
  const runtime = createRuntime({ requireParent: () => { runtime.calls.push('requireParent'); return false; } });

  const result = await showTestHistoryRuntime({ ...runtime, studentFilter: 'Zyon' });

  assert.deepEqual(result, { ok: false, reason: 'unauthorized' });
  assert.deepEqual(runtime.calls, ['requireParent']);
});
