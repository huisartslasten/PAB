import { describe, expect, it } from 'vitest';
import { createEditorElementRegistry } from './element-registry.js';

describe('createEditorElementRegistry', () => {
  it('registers and resolves editor elements by type', () => {
    const create = () => ({ type: 'text' });
    const registry = createEditorElementRegistry([{ type: 'text', create }]);

    expect(registry.has('text')).toBe(true);
    expect(registry.get('text')).toMatchObject({ type: 'text', create });
    expect(registry.list()).toHaveLength(1);
  });

  it('rejects duplicate element ownership', () => {
    const definition = { type: 'text', create: () => ({}) };
    expect(() => createEditorElementRegistry([definition, definition])).toThrow(
      'Editor element "text" is already registered.'
    );
  });

  it('requires a type and create contract', () => {
    expect(() => createEditorElementRegistry([{ create() {} }])).toThrow(
      'Editor element definition requires a type.'
    );
    expect(() => createEditorElementRegistry([{ type: 'text' }])).toThrow(
      'Editor element "text" requires create().'
    );
  });
});
