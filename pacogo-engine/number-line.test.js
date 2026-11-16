import assert from 'node:assert/strict';
import { createNumberLine, evaluatePlacement } from './number-line.js';

const line = createNumberLine({ min: 0, max: 10, step: 1 });

assert.equal(line.valueToPosition(0), 0);
assert.equal(line.valueToPosition(10), 1);
assert.equal(line.valueToPosition(7), 0.7);
assert.equal(line.positionToValue(0.7), 7);
assert.deepEqual(line.snapPosition(0.72), { value: 7, position: 0.7 });

const correct = evaluatePlacement({
  numberLine: line,
  targetValue: 7,
  submittedPosition: 0.7
});
assert.equal(correct.correct, true);
assert.equal(correct.absolute_error, 0);

const incorrect = evaluatePlacement({
  numberLine: line,
  targetValue: 7,
  submittedPosition: 0.5
});
assert.equal(incorrect.correct, false);
assert.equal(incorrect.submitted_value, 5);
assert.equal(incorrect.absolute_error, 2);

console.log('PacoGO number-line interaction tests passed.');
