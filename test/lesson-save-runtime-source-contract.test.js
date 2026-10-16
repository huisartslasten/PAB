import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function readSource(relativePath) {
  return readFile(resolve(root, relativePath), 'utf8');
}

test('lesson save runtime is owned by its canonical bootstrap and entry', async () => {
  const bootstrap = await readSource('src/features/lessons/lesson-save-runtime-bootstrap.js');
  const entry = await readSource('src/features/lessons/lesson-save-runtime-entry.js');

  assert.match(bootstrap, /loadRuntimeEntry\(\)/);
  assert.match(bootstrap, /installLessonSaveRuntimeEntry\(runtime\)/);
  assert.match(bootstrap, /target\.pacoGOLessonSaveRuntimeReady = readiness/);
  assert.match(entry, /export function installLessonSaveRuntimeEntry\(runtime\)/);
  assert.match(entry, /window\.saveLesson\s*=\s*async function saveLessonRuntimeEntry/);
  assert.match(entry, /createLessonWriteService\(app\.lessonService\)/);
  assert.doesNotMatch(bootstrap, /setTimeout/);
  assert.doesNotMatch(bootstrap, /legacySaveLesson/);
});

test('runtime entry requires the explicit V4.78 bridge and canonical lesson service', async () => {
  const source = await readSource('src/features/lessons/lesson-save-runtime-entry.js');

  for (const key of [
    'document',
    'currentSubject',
    'currentLesson',
    'currentSession',
    'PARENT_IDS',
    'lessons',
    'lessonService',
    'currentStudent',
    'normalizeSubvakKey',
    'renderTestCalendar',
    'refreshPageSidebars',
    'showMessage',
    'showHome',
    'loadLessons',
    'checkDictationSpelling',
    'upsertTestDate',
    'removeTestDate'
  ]) {
    assert.match(source, new RegExp(`['"]${key}['"]`));
  }

  assert.doesNotMatch(source, /createLessonWriteService\(app\.db\)/);
  assert.match(source, /createLessonWriteService\(app\.lessonService\)/);
  assert.match(source, /executeLessonSaveRuntimeEntry\(runtime\)/);
  assert.match(source, /window\.saveLesson\s*=\s*async function saveLessonRuntimeEntry/);
});

test('V4.78 monolith no longer contains the legacy saveLesson implementation', async () => {
  const source = await readSource('index.html');

  assert.doesNotMatch(source, /async function saveLesson\s*\(/);
  assert.doesNotMatch(source, /function saveLesson\s*\(/);
});

// Keep this source contract in the professional refactor gate: legacy save ownership must not return silently.
