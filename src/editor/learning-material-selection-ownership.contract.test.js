import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const editorPageSource = readFileSync(
  new URL('../features/learning-material/editor-page.js', import.meta.url),
  'utf8',
);

describe('learning material editor selection ownership', () => {
  it('delegates selection ownership to the central editor framework', () => {
    expect(editorPageSource).toContain("from '../../editor/selection.js'");
    expect(editorPageSource).toContain('createEditorSelectionStore()');
    expect(editorPageSource).not.toContain('const selectionBySurface = new WeakMap()');
    expect(editorPageSource).not.toMatch(/function rememberSelection\(/);
    expect(editorPageSource).not.toMatch(/function restoreSelection\(/);
    expect(editorPageSource).not.toMatch(/function setCaret\(/);
  });
});
