import test from 'node:test';
import assert from 'node:assert/strict';
import { LENGTH_ORDER_TASKS, evaluateLengthOrder } from './length-order-task-bank.js';

test('pencil task bank progresses from two to three to four pencils', () => {
  assert.deepEqual(LENGTH_ORDER_TASKS.map(task => task.lengths.length), [2, 3, 4]);
  assert.ok(LENGTH_ORDER_TASKS.every(task => task.lengths.length === task.initialOrder.length));
});

test('length ordering accepts only a strictly ascending arrangement', () => {
  const task = LENGTH_ORDER_TASKS[1];
  assert.equal(evaluateLengthOrder(task, [0, 1, 2]), true);
  assert.equal(evaluateLengthOrder(task, [2, 0, 1]), false);
  assert.equal(evaluateLengthOrder(task, [0, 0, 2]), false);
  assert.equal(evaluateLengthOrder(task, [0, 1]), false);
});
