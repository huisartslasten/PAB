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

test('clock task mode fixes source and response representations for all task forms', () => {
  assert.doesNotThrow(() => assertClockMode('analog_to_digital'));
  assert.doesNotThrow(() => assertClockMode('digital_to_analog'));
  assert.doesNotThrow(() => assertClockMode('match_representations'));
  assert.equal(responseRepresentationForMode('analog_to_digital'), 'digital');
  assert.equal(responseRepresentationForMode('digital_to_analog'), 'analog');
  assert.equal(responseRepresentationForMode('match_representations'), 'choice');
  assert.throws(
    () => assertClockMode('text'),
    /mode must be analog_to_digital, digital_to_analog or match_representations/
  );
});

test('analog clock representation identifies the first or second twelve hours of the etmaal', () => {\n  assert.equal(formatEtmaalHalf({ hour: 0 }), '00:00–11:59');\n  assert.equal(formatEtmaalHalf({ hour: 8 }), '00:00–11:59');\n  assert.equal(formatEtmaalHalf({ hour: 11 }), '00:00–11:59');\n  assert.equal(formatEtmaalHalf({ hour: 12 }), '12:00–23:59');\n  assert.equal(formatEtmaalHalf({ hour: 20 }), '12:00–23:59');\n  assert.equal(formatEtmaalHalf({ hour: 23 }), '12:00–23:59');\n  assert.throws(() => formatEtmaalHalf({ hour: 24 }), /hour must be an integer/);\n});\n