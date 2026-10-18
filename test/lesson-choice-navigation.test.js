import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const lessonChoice = await readFile(new URL('../lesson-choice.html', import.meta.url), 'utf8');

test('lesson choice uses the shared navigation owner', () => {
  assert.match(lessonChoice, /from ['"]\.\/src\/components\/page-navigation\.js['"]/);
  assert.match(lessonChoice, /createPacoNavigation\(\{\s*app,\s*active:\s*'lessons',\s*student,\s*viewMode:\s*context\.mode\s*\}\)/);
  assert.doesNotMatch(lessonChoice, /index\.html\?view=agenda/);
});
