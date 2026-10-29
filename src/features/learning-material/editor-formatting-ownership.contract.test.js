import { describe, expect, it } from 'vitest';
import { createEditorFormatting } from '../../editor/formatting.js';

const editorPageSource = await (await fetch(new URL('./editor-page.js', import.meta.url))).text();

describe('learning material formatting ownership contract', () => {
  it('uses the central formatting owner instead of local font-size functions', () => {
    expect(editorPageSource).toContain("import { createEditorFormatting } from '../../editor/formatting.js';");
    expect(editorPageSource).toContain('createEditorFormatting({ selectionStore, defaultFontSize: 22 })');
    expect(editorPageSource).not.toContain('function applyFontSize(');
    expect(editorPageSource).not.toContain('function insertTextWithFontSize(');
    expect(editorPageSource).toContain('formatting.applyFontSize(surface, size)');
    expect(editorPageSource).toContain('formatting.insertTextWithFontSize(surface, size, event.data)');
  });

  it('routes inline bold and italic formatting through the central formatting owner', () => {
    expect(editorPageSource).toContain('formatting.applyInlineFormat(surface, name)');
    expect(editorPageSource).not.toContain('surface.ownerDocument.execCommand(name, false)');
    expect(editorPageSource).not.toContain('const saved = selectionStore.restore(surface);');
  });

  it('keeps the central formatting API stable', () => {
    const selectionStore = { restore: () => null, remember: () => null };
    const formatting = createEditorFormatting({ selectionStore });
    expect(formatting.defaultFontSize).toBe(22);
    expect(typeof formatting.applyFontSize).toBe('function');
    expect(typeof formatting.insertTextWithFontSize).toBe('function');
    expect(typeof formatting.applyInlineFormat).toBe('function');
  });
});
