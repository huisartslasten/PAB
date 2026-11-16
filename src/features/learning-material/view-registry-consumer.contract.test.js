import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const viewRuntimeSource = readFileSync(
  fileURLToPath(new URL('./view-runtime.js', import.meta.url)),
  'utf8'
);

describe('learning material viewer registry consumer contract', () => {
  it('consumes the canonical learning material element registry', () => {
    expect(viewRuntimeSource).toContain("from './element-registry.js'");
    expect(viewRuntimeSource).toContain('normalizeLearningMaterialElement');
  });

  it('does not declare a second element-type switch before normalization', () => {
    expect(viewRuntimeSource).not.toMatch(/model\?\.elements[^\n]*\.map\(element => \{\s*if \(element\?\.type/);
  });
});