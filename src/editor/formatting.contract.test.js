import { describe, expect, it } from 'vitest';
import { createEditorFormatting } from './formatting.js';

describe('central editor formatting ownership contract', () => {
  it('requires the central selection owner', () => {
    expect(() => createEditorFormatting()).toThrow(TypeError);
  });

  it('exposes formatting operations without page-specific ownership', () => {
    const selectionStore = { restore: () => null, remember: () => null };
    const formatting = createEditorFormatting({ selectionStore });

    expect(formatting.defaultFontSize).toBe(22);
    expect(typeof formatting.applyFontSize).toBe('function');
    expect(typeof formatting.insertTextWithFontSize).toBe('function');
    expect(Object.isFrozen(formatting)).toBe(true);
  });
});
