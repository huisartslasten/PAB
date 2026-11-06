import assert from 'node:assert/strict';
import test from 'node:test';
import { createAdditionSupportOptions } from './addition-support-content.js';

test('addition support offers conceptual explanation, hint and example for quantity tasks', () => {
  const options = createAdditionSupportOptions({ task: { representation: 'quantity_groups' } });
  assert.deepEqual(options.map(option => option.support_type), ['explanation', 'hint', 'worked_example']);
  assert.match(options[1].content, /alle groepen/);
  assert.match(options[2].content, /3 \+ 2/);
  assert.ok(options.every(option => option.content_id && option.content_version === '0.1'));
});

test('addition support uses conceptual wording for symbolic tasks without prescribing a school algorithm', () => {
  const options = createAdditionSupportOptions({ task: { representation: 'symbolic_expression' } });
  assert.match(options[1].content, /hoeveelheden/);
  assert.doesNotMatch(options[1].content, /kolomsgewijs|splitsen|brug over het tiental/i);
});
