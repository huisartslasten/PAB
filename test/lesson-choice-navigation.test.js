import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const lessonChoice = await readFile(new URL('../lesson-choice.html', import.meta.url), 'utf8');
const routes = await readFile(new URL('../src/app/routes.js', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../src/features/lessons/lesson-choice-runtime.js', import.meta.url), 'utf8');

test('lesson choice delegates navigation to the canonical runtime and router', () => {
  assert.match(lessonChoice, /from ['"]\.\/src\/app\/runtime\.js['"]/);
  assert.match(lessonChoice, /startPacoRuntime\(/);
  assert.match(routes, /routes\[['"]lesson-choice\.html['"]\]\s*=\s*defineRoute\(\(\{ url, navigate \}\)/);
  assert.match(routes, /createLessonChoiceRuntime/);
  assert.match(runtime, /createPacoNavigation\(\{[\s\S]*navigate\s*\}\)/);
  assert.match(runtime, /navigate\(targetFor\(/);
  assert.doesNotMatch(lessonChoice, /index\.html\?view=agenda/);
});
