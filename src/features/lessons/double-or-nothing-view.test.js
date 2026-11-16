import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStakeOptions } from './double-or-nothing-view.js';

test('stake choices grow toward the current score without duplicates', () => {
  assert.deepEqual(buildStakeOptions(40), [10, 20, 40]);
  assert.deepEqual(buildStakeOptions(160), [10, 20, 40, 80, 160]);
  assert.deepEqual(buildStakeOptions(1280), [10, 20, 40, 80, 160, 320, 640, 1280]);
});

test('stake choices never exceed the available bones', () => {
  assert.deepEqual(buildStakeOptions(75), [10, 20, 40, 75]);
  assert.deepEqual(buildStakeOptions(0), []);
  assert.deepEqual(buildStakeOptions(-10), []);
});
