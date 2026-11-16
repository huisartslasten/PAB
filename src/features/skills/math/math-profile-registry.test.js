import test from 'node:test';
import assert from 'node:assert/strict';
import { getMathOperationPolicy, listMathOperationPolicies } from './math-profile-registry.js';

test('math operation policies expose explicit operand configuration', () => {
  assert.deepEqual(getMathOperationPolicy('addition'), { kind: 'math', operands: ['left', 'right'], fields: ['operands', 'resultMax'] });
  assert.deepEqual(getMathOperationPolicy('multiplication'), { kind: 'math', operands: ['left', 'right'], fields: ['operands'] });
  assert.deepEqual(getMathOperationPolicy('division'), { kind: 'math', operands: ['dividend', 'divisor'], fields: ['operands', 'remainderAllowed'] });
  assert.deepEqual(getMathOperationPolicy('fraction'), { kind: 'math', operands: ['left', 'right'], fields: ['fractionOperands', 'simplifyAnswer'] });
});

test('unknown operation policies resolve to null', () => {
  assert.equal(getMathOperationPolicy('unknown'), null);
});

test('operation policy registry exposes the five supported operation types', () => {
  const operations = listMathOperationPolicies().map(item => item.operation);
  assert.deepEqual(operations, ['addition', 'subtraction', 'multiplication', 'division', 'fraction']);
});
