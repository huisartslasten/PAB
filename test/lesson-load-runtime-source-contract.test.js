import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const entry = fs.readFileSync(new URL('../src/features/lessons/lesson-load-runtime-entry.js', import.meta.url), 'utf8');
const bootstrap = fs.readFileSync(new URL('../src/features/lessons/lesson-load-runtime-bootstrap.js', import.meta.url), 'utf8');

test('canonical lesson-load runtime owns lesson loading outside the legacy page', () => {
  assert.match(entry, /export async function executeLoadLessons\(runtime\)/);
  assert.match(entry, /createLessonService\(runtime\.db, \{ learningTopics: runtime\.learningTopics \}\)/);
  assert.match(entry, /loadLessonsRuntime\(/);
  assert.match(entry, /target\.loadLessonsRuntime/);
  assert.match(bootstrap, /installLessonLoadRuntimeEntry\(runtime, target\)/);
  assert.doesNotMatch(entry, /function loadLessons\(\)\{const \{data,error\}=await db\.from\('lessons'\)/);
});
