import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapTestAttemptRuntime } from '../src/features/test-history/test-attempt-runtime-bootstrap.js';

test('bootstrap installs the test-attempt runtime facade on the target', () => {
  const target = {};
  const db = { from() {} };
  const handler = bootstrapTestAttemptRuntime({
    runtime: { db, currentStudent: 'Zyon', currentLesson: { id: 1, type: 'words' } },
    target
  });
  assert.equal(typeof handler, 'function');
  assert.equal(target.saveTestAttempt, handler);
});
