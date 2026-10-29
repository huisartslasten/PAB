import { describe, expect, it } from 'vitest';
import { createEditorElementRegistry } from './element-registry.js';

describe('central editor ownership contract', () => {
  it('returns a stable immutable definition list', () => {
    const definition = { type: 'text', create: () => ({}) };
    const registry = createEditorElementRegistry([definition]);
    const list = registry.list();

    expect(Object.isFrozen(list[0])).toBe(true);
    expect(() => list.push(definition)).not.toThrow();
    expect(registry.list()).toHaveLength(1);
  });
});
