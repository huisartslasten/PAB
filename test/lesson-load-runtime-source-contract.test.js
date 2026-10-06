import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('legacy loadLessons implementation is removed from the V4.78 runtime', () => {
  assert.equal(
    /async function loadLessons\(\)\{const \{data,error\}=await db\.from\('lessons'\)/.test(source),
    false,
    'index.html still contains the legacy loadLessons implementation'
  );
  assert.match(source, /pacoGOLessonLoadRuntimeReady/);
  assert.match(source, /lesson-load-runtime-bootstrap\.js/);
});
