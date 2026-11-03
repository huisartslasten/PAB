import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDigitalTime } from './clock-learning-interface.js';

test('clock learning interface formats digital time consistently', () => {
  assert.equal(formatDigitalTime({ hour: 8, minute: 5 }), '08:05');
  assert.equal(formatDigitalTime({ hour: 23, minute: 59 }), '23:59');
});
