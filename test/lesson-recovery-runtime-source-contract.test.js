import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const bootstrap = await readFile(new URL('../src/features/lessons/lesson-recovery-runtime-bootstrap.js', import.meta.url), 'utf8');
const entry = await readFile(new URL('../src/features/lessons/lesson-recovery-runtime-entry.js', import.meta.url), 'utf8');

test('recovery runtime is owned by its canonical bootstrap and entry', () => {
  assert.match(bootstrap, /loadEntry\(\)/);
  assert.match(bootstrap, /installLessonRecoveryRuntimeEntry\(runtime, target\)/);
  assert.match(entry, /export function installLessonRecoveryRuntimeEntry\(runtime, target = globalThis\)/);
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
  assert.doesNotMatch(entry, /setTimeout/);
});
