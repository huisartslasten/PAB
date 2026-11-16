import { describe, expect, it } from 'vitest';
import { createEditorSelectionStore, selectionIsInside } from './selection.js';

describe('central editor selection contract', () => {
  it('keeps selection ownership inside the editor surface', () => {
    const surface = { contains: node => node === 'inside' };
    const inside = { commonAncestorContainer: 'inside' };
    const outside = { commonAncestorContainer: 'outside' };

    expect(selectionIsInside(surface, inside)).toBe(true);
    expect(selectionIsInside(surface, outside)).toBe(false);
  });

  it('exposes an immutable selection store API', () => {
    const store = createEditorSelectionStore({ documentRef: null });

    expect(Object.isFrozen(store)).toBe(true);
    expect(typeof store.remember).toBe('function');
    expect(typeof store.restore).toBe('function');
    expect(typeof store.setCaret).toBe('function');
    expect(typeof store.captureDocumentSelection).toBe('function');
  });
});
