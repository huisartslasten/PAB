import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function readSource(relativePath) {
  return readFile(resolve(root, relativePath), 'utf8');
}

test('classic-script save facade is wired through the single bootstrap readiness contract', async () => {
  const source = await readSource('photo-storage.js');

  assert.match(source, /const lessonSaveRuntimeBootstrap\s*=\s*import\('\.\/src\/features\/lessons\/lesson-save-runtime-bootstrap\.js'\)/);
  assert.match(source, /window\.pacoGOLessonSaveRuntimeReady\s*=\s*lessonSaveRuntimeBootstrap/);
  assert.match(source, /window\.saveLesson\s*=\s*async function saveLessonRuntimeFacade/);
  assert.match(source, /const runtimeSaveLesson = await lessonSaveRuntimeBootstrap/);
  assert.match(source, /return runtimeSaveLesson\(\.\.\.args\)/);

  const bootstrapDeclarations = source.match(/const lessonSaveRuntimeBootstrap\s*=/g) || [];
  assert.equal(bootstrapDeclarations.length, 1, 'the classic-script boundary must create exactly one bootstrap promise');

  const facadeIndex = source.indexOf('window.saveLesson = async function saveLessonRuntimeFacade');
  const bootstrapIndex = source.indexOf('const lessonSaveRuntimeBootstrap =');
  assert.ok(bootstrapIndex >= 0 && facadeIndex > bootstrapIndex, 'the facade must be defined from the single bootstrap contract');

  assert.doesNotMatch(source, /catch\s*\([^)]*\)\s*\{[^}]*saveLesson\s*\(/s);
  assert.doesNotMatch(source, /setTimeout\([^\n]*saveLesson/s);
  assert.doesNotMatch(source, /window\.saveLesson\s*=\s*async function[^\{]*\{[^}]*legacy/i);
});

test('bootstrap contract installs the refactored runtime and exposes only its callable entry', async () => {
  const source = await readSource('src/features/lessons/lesson-save-runtime-bootstrap.js');

  assert.match(source, /loadRuntimeEntry\(\)/);
  assert.match(source, /installLessonSaveRuntimeEntry\(runtime\)/);
  assert.match(source, /const installedSaveLesson = target\.saveLesson/);
  assert.match(source, /typeof installedSaveLesson !== 'function'/);
  assert.match(source, /target\.pacoGOLessonSaveRuntimeReady = readiness/);
  assert.match(source, /return installedSaveLesson/);

  assert.doesNotMatch(source, /setTimeout/);
  assert.doesNotMatch(source, /legacySaveLesson/);
});

test('runtime entry requires the explicit V4.78 bridge instead of resolving legacy lexical bindings', async () => {
  const source = await readSource('src/features/lessons/lesson-save-runtime-entry.js');

  for (const key of [
    'document',
    'db',
    'currentSubject',
    'currentLesson',
    'currentSession',
    'PARENT_IDS',
    'lessons',
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

  assert.match(source, /executeLessonSaveRuntimeEntry\(runtime\)/);
  assert.match(source, /window\.saveLesson\s*=\s*async function saveLessonRuntimeEntry/);
});
