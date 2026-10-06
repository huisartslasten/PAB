import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('index delegates lesson ordering to the professional runtime boundary', () => {
  assert.match(source, /lessonOrderRuntimeBootstrap/);
  assert.match(source, /pacoGOLessonOrderRuntimeReady/);
  assert.doesNotMatch(source, /function getLessonOrderKey\s*\(/);
  assert.doesNotMatch(source, /function getLocalLessonOrder\s*\(/);
  assert.doesNotMatch(source, /function applyLessonOrder\s*\(/);
  assert.doesNotMatch(source, /db\.from\(['"]lesson_order['"]\)/);
});
