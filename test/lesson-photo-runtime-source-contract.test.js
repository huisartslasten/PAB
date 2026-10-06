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

  assert.doesNotMatch(source, /async function createLessonFromPhoto\s*\(/, 'the legacy createLessonFromPhoto implementation must be removed from the monolith');
  assert.doesNotMatch(source, /function createLessonFromPhoto\s*\(/, 'the monolith must not retain another legacy createLessonFromPhoto declaration');
});

test('classic-script photo facade is wired through the single bootstrap readiness contract', async () => {
  const source = await readSource('photo-storage.js');

  assert.match(source, /const lessonPhotoRuntimeBootstrap\s*=\s*import\('\.\/src\/features\/lessons\/lesson-photo-runtime-bootstrap\.js'\)/);
  assert.match(source, /window\.pacoGOLessonPhotoRuntimeReady\s*=\s*lessonPhotoRuntimeBootstrap/);
  assert.match(source, /window\.createLessonFromPhoto\s*=\s*async function createLessonFromPhotoRuntimeFacade/);
  assert.match(source, /const runtimeHandler = await lessonPhotoRuntimeBootstrap/);
  assert.match(source, /return runtimeHandler\(input\)/);

  const bootstrapDeclarations = source.match(/const lessonPhotoRuntimeBootstrap\s*=/g) || [];
  assert.equal(bootstrapDeclarations.length, 1, 'the classic-script boundary must create exactly one photo bootstrap promise');

  const facadeIndex = source.indexOf('window.createLessonFromPhoto = async function createLessonFromPhotoRuntimeFacade');
  const bootstrapIndex = source.indexOf('const lessonPhotoRuntimeBootstrap =');
  assert.ok(bootstrapIndex >= 0 && facadeIndex > bootstrapIndex, 'the photo facade must be defined from the single bootstrap contract');

  assert.doesNotMatch(source, /catch\s*\([^)]*\)\s*\{[^}]*createLessonFromPhoto\s*\(/s);
  assert.doesNotMatch(source, /setTimeout\([^\n]*createLessonFromPhoto/s);
});

// Keep this source contract in the professional refactor gate: photo lesson creation
// ownership must remain in the refactored runtime and must not silently return to index.html.
