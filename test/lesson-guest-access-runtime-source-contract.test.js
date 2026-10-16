import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const indexSource = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
const bootstrapSource = fs.readFileSync(path.join(repoRoot, 'src/features/lessons/lesson-guest-access-runtime-bootstrap.js'), 'utf8');
const entrySource = fs.readFileSync(path.join(repoRoot, 'src/features/lessons/lesson-guest-access-runtime-entry.js'), 'utf8');

test('V4.78 guest access handler is no longer declared in index.html', () => {
  assert.doesNotMatch(indexSource, /async function setGuestLesson\s*\(/);
  assert.doesNotMatch(indexSource, /function setGuestLesson\s*\(/);
});

test('guest access runtime is owned by its canonical bootstrap and entry', () => {
  assert.match(bootstrapSource, /loadRuntimeEntry\(\)/);
  assert.match(bootstrapSource, /installLessonGuestAccessRuntimeEntry\(runtime, target\)/);
  assert.match(bootstrapSource, /target\.pacoGOLessonGuestAccessRuntimeReady = readiness/);
  assert.match(entrySource, /export function installLessonGuestAccessRuntimeEntry\(runtime, target = globalThis\)/);
  assert.match(entrySource, /target\.setGuestLesson\s*=/);
  assert.match(entrySource, /target\.pacoGOLoadGuestLessonAccess\s*=/);
  assert.doesNotMatch(entrySource, /setTimeout/);
});
