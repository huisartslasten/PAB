import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const entry = await readFile(new URL('../src/features/lessons/lesson-recovery-runtime-entry.js', import.meta.url), 'utf8');
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

test('canonical recovery runtime owns the four recovery handlers outside the legacy page', () => {
  assert.match(entry, /export async function executeMoveCurrentLessonToTrash\(runtime\)/);
  assert.match(entry, /export async function executeArchiveCurrentLesson\(runtime\)/);
  assert.match(entry, /export async function executeRestoreArchivedLesson\(runtime, lessonId\)/);
  assert.match(entry, /export async function executeRestoreDeletedLesson\(runtime, lessonId\)/);
  for (const declaration of [
    'target.confirmDeleteLesson',
    'target.confirmArchiveLesson',
    'target.restoreArchivedLesson',
    'target.restoreDeletedLesson'
  ]) {
    assert.match(entry, new RegExp(declaration.replace('.', '\\.') + '\\s*='));
  }
  assert.doesNotMatch(entry, /function deleteCurrentLesson\(\)/);
  assert.doesNotMatch(entry, /function closeDeleteModal\(\)/);
  assert.doesNotMatch(entry, /function archiveCurrentLesson\(\)/);
  assert.doesNotMatch(entry, /function closeArchiveModal\(\)/);
});
