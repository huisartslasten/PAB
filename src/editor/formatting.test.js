import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorFormatting } from './formatting.js';

test('central editor formatting requires the central selection owner', () => {
  assert.throws(
    () => createEditorFormatting(),
    /requires a selection store/
  );
});

test('central editor formatting exposes one immutable formatting owner', () => {
  const selectionStore = {
    restore() { return null; },
    remember() {},
  };
  const formatting = createEditorFormatting({ selectionStore });

  assert.equal(formatting.defaultFontSize, 22);
  assert.equal(Object.isFrozen(formatting), true);
  assert.equal(formatting.applyFontSize({}, 28), false);
});

test('central editor formatting rejects empty insertions before touching the DOM', () => {
  const selectionStore = {
    restore() { return null; },
    remember() {},
  };
  const formatting = createEditorFormatting({ selectionStore });

  assert.equal(formatting.insertTextWithFontSize(null, 28, ''), false);
});
