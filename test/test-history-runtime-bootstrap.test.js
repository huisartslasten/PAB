import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapTestHistoryRuntime } from '../src/features/test-history/test-history-runtime-bootstrap.js';

function runtime() {
  return {
    db: { from() {} },
    requireParent() { return true; },
    hideAll() {},
    showPage() {},
    setGreeting() {},
    setLoading() {},
    refreshSidebars() {},
    renderAttempts() {},
    renderError() {}
  };
}

test('test history bootstrap installs the runtime entry on the supplied target', () => {
  const target = {};
  const installed = bootstrapTestHistoryRuntime({ runtime: runtime(), target });

  assert.equal(installed, target.showTestHistoryRuntime);
  assert.equal(typeof installed, 'function');
});

test('test history bootstrap requires a runtime bridge', () => {
  assert.throws(
    () => bootstrapTestHistoryRuntime({ target: {} }),
    /A test-history runtime bridge is required\./
  );
});
