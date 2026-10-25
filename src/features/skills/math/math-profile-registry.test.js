import test from 'node:test';
import assert from 'node:assert/strict';
import { getMathOperationPolicy, listMathOperationPolicies } from './math-profile-registry.js';

test('math operation policies expose configurable fields', () => {
  assert.deepEqual(getMathOperationPolicy('addition'), { kind: 'math', fields: ['operandMin', 'resultMax'] });
  assert.deepEqual(getMathOperationPolicy('multiplication'), { kind: 'math', fields: ['factorMin', 'factorMax'] });
});

test('unknown operation policies resolve to null', () => {
  assert.equal(getMathOperationPolicy('unknown'), null);
});

test('operation policy registry stays extensible', () => {
  const operations = listMathOperationPolicies().map(item => item.operation);
  assert.deepEqual(operations, ['addition', 'subtraction', 'multiplication']);
});
