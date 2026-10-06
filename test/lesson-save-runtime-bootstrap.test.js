import test from 'node:test';
import assert from 'node:assert/strict';

import { bootstrapLessonSaveRuntime } from '../src/features/lessons/lesson-save-runtime-bootstrap.js';

test('bootstrap publishes readiness and installs the runtime entry exactly once', async () => {
  const calls = [];
  const target = { saveLesson: async () => 'legacy' };
  const runtime = {};
  const installed = async () => ({ ok: true });

  const readiness = bootstrapLessonSaveRuntime({
    runtime,
    target,
    loadRuntimeEntry: async () => {
      calls.push('load');
      return {
        installLessonSaveRuntimeEntry(app) {
          calls.push(['install', app]);
          target.saveLesson = installed;
        }
      };
    }
  });

  assert.strictEqual(target.pacoGOLessonSaveRuntimeReady, readiness);
  assert.notStrictEqual(target.saveLesson, installed);

  const readyEntry = await readiness;
  assert.strictEqual(readyEntry, installed);
  assert.deepEqual(calls, [['load'], ['install', runtime]]);
});

test('bootstrap rejects a failed module load instead of falling back to legacy save execution', async () => {
  const legacySaveLesson = async () => 'legacy';
  const target = { saveLesson: legacySaveLesson };
  const failure = new Error('module unavailable');

  const readiness = bootstrapLessonSaveRuntime({
    runtime: {},
    target,
    loadRuntimeEntry: async () => { throw failure; }
  });

  await assert.rejects(readiness, error => error === failure);
  assert.strictEqual(target.saveLesson, legacySaveLesson);
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
