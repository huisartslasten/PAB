import test from 'node:test';
import assert from 'node:assert/strict';

import { bootstrapLessonSaveRuntime } from '../src/features/lessons/lesson-save-runtime-bootstrap.js';

test('bootstrap publishes readiness and installs the runtime entry exactly once', async () => {
  const calls = [];
  const target = { saveLesson: async () => 'legacy' };
  const runtime = {};
  const installed = async () => 'installed';

  const readiness = bootstrapLessonSaveRuntime({
    runtime,
    target,
    loadRuntimeEntry: async () => {
      calls.push('load');
      return {
        installLessonSaveRuntimeEntry(app, runtimeTarget) {
          calls.push(['install', app, runtimeTarget]);
          runtimeTarget.saveLesson = installed;
        }
      };
    }
  });

  assert.strictEqual(target.pacoGOLessonSaveRuntimeReady, readiness);
  assert.notStrictEqual(target.saveLesson, installed);

  const readyEntry = await readiness;
  assert.strictEqual(readyEntry, installed);
  assert.deepEqual(calls, ['load', ['install', runtime, target]]);
});

test('bootstrap keeps the readiness facade when module loading fails instead of falling back to legacy save execution', async () => {
  const legacySaveLesson = async () => 'legacy';
  const target = { saveLesson: legacySaveLesson };
  const failure = new Error('module unavailable');

  const readiness = bootstrapLessonSaveRuntime({
    runtime: {},
    target,
    loadRuntimeEntry: async () => { throw failure; }
  });

  assert.notStrictEqual(target.saveLesson, legacySaveLesson);
  await assert.rejects(readiness, error => error === failure);
  await assert.rejects(target.saveLesson(), error => error === failure);
});

test('bootstrap rejects an installer contract mismatch', async () => {
  const target = { saveLesson: async () => 'legacy' };

  const readiness = bootstrapLessonSaveRuntime({
    runtime: {},
    target,
    loadRuntimeEntry: async () => ({})
  });

  await assert.rejects(readiness, /installer is unavailable/);
});
