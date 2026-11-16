import { describe, expect, it } from 'vitest';
import { createEditorToolbar } from './toolbar.js';

describe('central editor toolbar ownership contract', () => {
  it('normalizes and exposes registered commands', () => {
    const run = () => true;
    const toolbar = createEditorToolbar([{ name: 'bold', run }]);

    expect(toolbar.has('BOLD')).toBe(true);
    expect(toolbar.get('bold').run).toBe(run);
    expect(Object.isFrozen(toolbar.get('bold'))).toBe(true);
    expect(toolbar.list()).toHaveLength(1);
  });

  it('executes only registered commands', () => {
    const calls = [];
    const toolbar = createEditorToolbar([{ name: 'italic', run: context => { calls.push(context); return true; } }]);

    expect(toolbar.execute('italic', { surface: {} })).toBe(true);
    expect(toolbar.execute('bold', { surface: {} })).toBe(false);
    expect(calls).toHaveLength(1);
  });

  it('rejects duplicate or invalid commands', () => {
    expect(() => createEditorToolbar([{ name: 'bold', run() {} }, { name: 'bold', run() {} }])).toThrow();
    expect(() => createEditorToolbar([{ name: 'bold' }])).toThrow(TypeError);
  });
});
