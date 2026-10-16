import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function readSource(relativePath) {
  return readFile(resolve(root, relativePath), 'utf8');
}

test('V4.78 monolith no longer contains the legacy createLessonFromPhoto implementation', async () => {
  const source = await readSource('index.html');

  assert.doesNotMatch(source, /async function createLessonFromPhoto\s*\(/);
  assert.doesNotMatch(source, /function createLessonFromPhoto\s*\(/);
});

test('photo runtime is owned by its canonical bootstrap and entry', async () => {
  const bootstrap = await readSource('src/features/lessons/lesson-photo-runtime-bootstrap.js');
  const entry = await readSource('src/features/lessons/lesson-photo-runtime-entry.js');

  assert.match(bootstrap, /loadEntry\(\)/);
  assert.match(bootstrap, /installLessonPhotoRuntimeEntry\(runtime, target\)/);
  assert.match(entry, /export function installLessonPhotoRuntimeEntry\(runtime, target = globalThis\)/);
  assert.match(entry, /target\.createLessonFromPhotoRuntime\s*=/);
  assert.match(entry, /createLessonFromPhotoPersistence\(\{ lessonService: runtime\.lessonService/);
  assert.doesNotMatch(entry, /setTimeout/);
});

// Keep this source contract in the professional refactor gate: photo lesson creation
// ownership must remain in the refactored runtime and must not silently return to index.html.
