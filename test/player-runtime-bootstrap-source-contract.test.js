import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/features/lessons/player-runtime-bootstrap.js', import.meta.url), 'utf8');

test('professional player bridge keeps the application seam explicit', () => {
  assert.match(source, /createPlayerRuntimeEntry/);
  assert.match(source, /createPlayerScreenBoundary/);
  assert.match(source, /createPlayerTestView/);
  assert.match(source, /createPlayerResultRenderer/);
  assert.match(source, /prepareTestView:/);
  assert.match(source, /renderTest:/);
  assert.match(source, /renderResult:/);
  assert.match(source, /submitTest\(options = \{\}\)/);
  assert.match(source, /startTest\(type\)/);
});
