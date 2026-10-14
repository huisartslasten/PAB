import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const entry = await readFile(new URL('../src/features/lessons/lesson-order-runtime-entry.js', import.meta.url), 'utf8');
const bootstrap = await readFile(new URL('../src/features/lessons/lesson-order-runtime-bootstrap.js', import.meta.url), 'utf8');
const service = await readFile(new URL('../src/features/lessons/lesson-order-service.js', import.meta.url), 'utf8');

test('canonical lesson ordering owns runtime delegation and persistence outside the legacy page', () => {
  assert.match(bootstrap, /installLessonOrderRuntimeEntry\(runtime, target\)/);
  assert.match(entry, /createLessonOrderService\(\{ db: runtime\.db, storage: runtime\.storage \}\)/);
  assert.match(entry, /getOrderedLessonsRuntime\(/);
  assert.match(entry, /saveLessonOrderRuntime\(/);
  assert.match(entry, /target\.pacoGOGetOrderedLessons/);
  assert.match(entry, /target\.pacoGOSaveLessonOrder/);
  assert.match(service, /export function createLessonOrderService/);
  assert.doesNotMatch(entry, /function getLessonOrderKey\s*\(/);
  assert.doesNotMatch(entry, /function getLocalLessonOrder\s*\(/);
  assert.doesNotMatch(entry, /function applyLessonOrder\s*\(/);
  assert.doesNotMatch(entry, /db\.from\(['"]lesson_order['"]\)/);
});
