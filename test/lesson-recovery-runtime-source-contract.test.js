import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const indexHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const photoStorage = await readFile(new URL('../photo-storage.js', import.meta.url), 'utf8');

test('recovery runtime facade publishes readiness and all four public handlers', () => {
  assert.match(photoStorage, /const lessonRecoveryRuntimeBridge = Object\.defineProperties\(\{\}/);
  assert.match(photoStorage, /const lessonRecoveryRuntimeBootstrap = import\('\.\/src\/features\/lessons\/lesson-recovery-runtime-bootstrap\.js'\)/);
  assert.match(photoStorage, /window\.pacoGOLessonRecoveryRuntimeReady = lessonRecoveryRuntimeBootstrap;/);
  for (const name of ['confirmDeleteLesson', 'confirmArchiveLesson', 'restoreArchivedLesson', 'restoreDeletedLesson']) {
    assert.match(photoStorage, new RegExp(`window\\.${name} = async function`));
  }
  assert.match(photoStorage, /There is deliberately no legacy fallback/);
});

test('V4.78 recovery globals are fully owned by the refactored runtime facade', () => {
  assert.match(indexHtml, /function deleteCurrentLesson\(\)/);
  assert.match(indexHtml, /function closeDeleteModal\(\)/);
  assert.match(indexHtml, /function archiveCurrentLesson\(\)/);
  assert.match(indexHtml, /function closeArchiveModal\(\)/);
  for (const declaration of [
    'async function confirmDeleteLesson()',
    'async function confirmArchiveLesson()',
    'async function restoreArchivedLesson(id)',
    'async function restoreDeletedLesson(id)'
  ]) {
    const escaped = declaration.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    assert.doesNotMatch(indexHtml, new RegExp(escaped));
  }
});
