import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = path => readFileSync(join(root, path), 'utf8');

describe('learning material editor architecture', () => {
  it('keeps learner, topic and card ownership in the learning-material feature', () => {
    const page = read('src/features/learning-material/editor-page.js');
    const runtime = read('src/features/learning-material/editor-runtime.js');
    const routes = read('src/app/routes.js');

    assert.ok(page.includes('data-field="student"'));
    assert.ok(page.includes('learningContent.resolveTopic'));
    assert.ok(page.includes('learningContent.uploadCardImage'));
    assert.ok(page.includes("root.addEventListener('drop'"));
    assert.ok(runtime.includes("import { listStudents } from '../students/students.js';"));
    assert.ok(runtime.includes("buildViewUrl('learning-material.html'"));
    assert.ok(routes.includes("routes['learning-material.html']"));
    assert.ok(routes.includes("routes['learning-material-editor.html']"));
  });
});
