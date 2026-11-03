import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDigitalTime,
  assertClockMode,
  responseRepresentationForMode
} from './clock-learning-interface.js';

test('clock learning interface formats digital time consistently', () => {
  assert.equal(formatDigitalTime({ hour: 8, minute: 5 }), '08:05');
  assert.equal(formatDigitalTime({ hour: 23, minute: 59 }), '23:59');
});

test('clock task mode fixes source and response representations', () => {
  assert.doesNotThrow(() => assertClockMode('analog_to_digital'));
  assert.doesNotThrow(() => assertClockMode('digital_to_analog'));
  assert.equal(responseRepresentationForMode('analog_to_digital'), 'digital');
  assert.equal(responseRepresentationForMode('digital_to_analog'), 'analog');
  assert.throws(() => assertClockMode('text'), /mode must be analog_to_digital or digital_to_analog/);
});
