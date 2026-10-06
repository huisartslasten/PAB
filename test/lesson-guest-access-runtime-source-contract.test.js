import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const indexSource = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
const photoStorageSource = fs.readFileSync(path.join(repoRoot, 'photo-storage.js'), 'utf8');

test('V4.78 guest access handler is no longer declared in index.html', () => {
  assert.doesNotMatch(indexSource, /async function setGuestLesson\s*\(/);
  assert.doesNotMatch(indexSource, /function setGuestLesson\s*\(/);
});

test('photo-storage exposes the refactored guest access runtime facade', () => {
  assert.match(photoStorageSource, /pacoGOLessonGuestAccessRuntimeReady/);
  assert.match(photoStorageSource, /lesson-guest-access-runtime-bootstrap\.js/);
  assert.match(photoStorageSource, /window\.setGuestLesson\s*=\s*async function setGuestLessonRuntimeFacade/);
});
