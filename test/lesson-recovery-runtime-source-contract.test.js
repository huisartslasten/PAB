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

test('active V4.78 recovery globals remain the exact public handlers until browser proof closes the boundary', () => {
  assert.match(indexHtml, /function closeDeleteModal\(\)/);
  assert.match(indexHtml, /function closeArchiveModal\(\)/);
  assert.match(indexHtml, /async function confirmDeleteLesson\(\)/);
  assert.match(indexHtml, /async function confirmArchiveLesson\(\)/);
  assert.match(indexHtml, /async function restoreArchivedLesson\(id\)/);
  assert.match(indexHtml, /async function restoreDeletedLesson\(id\)/);
});
