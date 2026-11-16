import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const editorPageSource = readFileSync(
  fileURLToPath(new URL('./editor-page.js', import.meta.url)),
  'utf8'
);

describe('learning material editor registry consumer contract', () => {
  it('consumes the canonical learning material element registry', () => {
    expect(editorPageSource).toContain("from './element-registry.js'");
    expect(editorPageSource).toContain('normalizeLearningMaterialElement');
  });

  it('does not declare a second local element registry', () => {
    expect(editorPageSource).not.toMatch(/createEditorElementRegistry\s*\(/);
    expect(editorPageSource).not.toMatch(/const\s+ELEMENT_(REGISTRY|DEFINITIONS)/);
  });
});
