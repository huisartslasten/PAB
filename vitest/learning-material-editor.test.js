import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = path => readFileSync(join(root, path), 'utf8');

describe('learning material editor architecture', () => {
  it('keeps learner, topic and card ownership in the learning-material feature', () => {
    const page = read('src/features/learning-material/editor-page.js');
    const runtime = read('src/features/learning-material/editor-runtime.js');
    const routes = read('src/app/routes.js');
    expect(page).toContain('data-field="student"');
    expect(page).toContain('learningContent.resolveTopic');
    expect(page).toContain('learningContent.uploadCardImage');
    expect(page).toContain("root.addEventListener('drop'");
    expect(runtime).toContain("import { listStudents } from '../students/students.js';");
    expect(runtime).toContain("buildViewUrl('learning-material.html'");
    expect(routes).toContain("routes['learning-material.html']");
    expect(routes).toContain("routes['learning-material-editor.html']");
  });
});
