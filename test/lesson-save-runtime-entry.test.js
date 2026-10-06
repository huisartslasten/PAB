import test from 'node:test';
import assert from 'node:assert/strict';

import { installLessonSaveRuntimeEntry } from '../src/features/lessons/lesson-save-runtime-entry.js';

test('runtime entry replaces window.saveLesson and returns the legacy function', () => {
  const legacySaveLesson = async () => 'legacy';
  const previousWindow = globalThis.window;
  globalThis.window = { saveLesson: legacySaveLesson };

  try {
    const returnedLegacy = installLessonSaveRuntimeEntry();

    assert.strictEqual(returnedLegacy, legacySaveLesson);
    assert.notStrictEqual(globalThis.window.saveLesson, legacySaveLesson);
    assert.equal(globalThis.window.saveLesson.name, 'saveLessonRuntimeEntry');
  } finally {
    globalThis.window = previousWindow;
  }
});

test('runtime entry installation preserves the legacy function for rollback', () => {
  const legacySaveLesson = function legacySaveLesson() {};
  const previousWindow = globalThis.window;
  globalThis.window = { saveLesson: legacySaveLesson };

  try {
    const returnedLegacy = installLessonSaveRuntimeEntry();
    assert.strictEqual(returnedLegacy, legacySaveLesson);
  } finally {
    globalThis.window = previousWindow;
  }
});
