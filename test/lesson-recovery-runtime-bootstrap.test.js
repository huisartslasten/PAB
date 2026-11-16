import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapLessonRecoveryRuntime } from '../src/features/lessons/lesson-recovery-runtime-bootstrap.js';

function bridge() { return {}; }

test('bootstrap publishes readiness and installs the recovery entry exactly once', async () => {
  const target = {};
  const calls = [];
  const runtime = bridge();
  const result = await bootstrapLessonRecoveryRuntime({
    runtime,
    target,
    loadRuntimeEntry: async () => ({
      installLessonRecoveryRuntimeEntry(receivedRuntime, receivedTarget) {
        calls.push([receivedRuntime, receivedTarget]);
        receivedTarget.confirmDeleteLesson = () => 'installed';
      }
    })
  });
  assert.equal(result, target);
  assert.equal(target.pacoGOLessonRecoveryRuntimeReady instanceof Promise, true);
  assert.equal(target.confirmDeleteLesson(), 'installed');
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], runtime);
  assert.equal(calls[0][1], target);
});

test('bootstrap rejects a loader failure without fallback installation', async () => {
  const target = {};
  const error = new Error('loader failed');
  const readiness = bootstrapLessonRecoveryRuntime({
    runtime: bridge(),
    target,
    loadRuntimeEntry: async () => { throw error; }
  });
  await assert.rejects(readiness, error);
  assert.equal(target.confirmDeleteLesson, undefined);
});

test('bootstrap rejects an installer contract mismatch', async () => {
  const target = {};
  const readiness = bootstrapLessonRecoveryRuntime({
    runtime: bridge(),
    target,
    loadRuntimeEntry: async () => ({})
  });
  await assert.rejects(readiness, /installer is unavailable/);
});
