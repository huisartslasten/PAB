import test from 'node:test';
import assert from 'node:assert/strict';
import { fractionsEqual, parseFraction, evaluatePracticeDeterministicAnswer } from './practice-evaluation.js';

test('parseFraction normalizes simple fractions', () => {
  assert.deepEqual(parseFraction('2/4'), { numerator: 1, denominator: 2 });
  assert.deepEqual(parseFraction('1/2'), { numerator: 1, denominator: 2 });
});

test('fractionsEqual accepts equivalent fractions', () => {
  assert.equal(fractionsEqual('2/4', '1/2'), true);
  assert.equal(fractionsEqual('3/4', '2/3'), false);
});

test('fraction lesson answers are graded deterministically', () => {
  assert.equal(evaluatePracticeDeterministicAnswer('math', { response_type: 'fraction', answer: '3/4' }, '6/8'), true);
  assert.equal(evaluatePracticeDeterministicAnswer('math', { response_type: 'fraction', answer: '3/4' }, '2/4'), false);
});

test('multiple choice lesson answers use the selected option', () => {
  const item = { response_type: 'multiple_choice', answer: '3/4', answer_options: ['1/2', '3/4', '4/3'] };
  assert.equal(evaluatePracticeDeterministicAnswer('math', item, '3/4'), true);
  assert.equal(evaluatePracticeDeterministicAnswer('math', item, '1/2'), false);
});
