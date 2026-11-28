import test from 'node:test';
import assert from 'node:assert/strict';
import { FRACTION_LIKE_DENOMINATOR_DIVISION_GUIDED_TASKS as tasks } from './fraction-like-denominator-division-guided-task-bank.js';
import { createFractionLikeDenominatorDivisionGuidedSession } from './fraction-like-denominator-division-guided-session.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

test('guided like-denominator division has ten unique, mathematically valid tasks', () => {
  assert.equal(tasks.length, 10);
  assert.equal(new Set(tasks.map(task => task.id)).size, 10);
  for (const task of tasks) {
    assert.equal(task.left.denominator, task.right.denominator);
    assert.ok(task.left.numerator < task.left.denominator);
    assert.ok(task.right.numerator < task.right.denominator);
    assert.ok(task.left.numerator > task.right.numerator);
    const n = task.left.numerator * task.right.denominator;
    const d = task.left.denominator * task.right.numerator;
    assert.equal((task.answer.whole * task.answer.denominator + task.answer.numerator) * d, n * task.answer.denominator);
  }
});

test('guided division advances through three steps and waits for explicit next task outside the session', () => {
  const session = createFractionLikeDenominatorDivisionGuidedSession({ learnerKey: 'test-learner', storage: memoryStorage(), tasks });
  let step = session.getCurrentStep();
  assert.equal(step.stepId, 'invert_divisor');
  let result = session.recordResponse({ numerator: step.inverse.numerator, denominator: step.inverse.denominator });
  assert.equal(result.classification, 'valid');
  step = result.currentStep;
  assert.equal(step.stepId, 'multiply_fractions');
  result = session.recordResponse({ numerator: step.product.numerator, denominator: step.product.denominator });
  assert.equal(result.classification, 'valid');
  step = result.currentStep;
  assert.equal(step.stepId, 'simplify_quotient');
  result = session.recordResponse({ values: {
    wholeNumber: String(step.task.answer.whole),
    numerator: String(step.task.answer.numerator),
    denominator: String(step.task.answer.denominator),
    wholeNumberEnabled: true
  }});
  assert.equal(result.classification, 'valid');
  assert.equal(result.progress.completedCount, 1);
  assert.equal(result.progress.completedStepCount, 3);
  assert.equal(result.currentStep.taskNumber, 2);
});

test('all ten guided division tasks complete in thirty valid steps', () => {
  const session = createFractionLikeDenominatorDivisionGuidedSession({ learnerKey: 'complete-learner', storage: memoryStorage(), tasks });
  for (let i = 0; i < 10; i += 1) {
    let step = session.getCurrentStep();
    assert.equal(step.stepId, 'invert_divisor');
    let result = session.recordResponse({ numerator: step.inverse.numerator, denominator: step.inverse.denominator });
    assert.equal(result.classification, 'valid');
    step = result.currentStep;
    result = session.recordResponse({ numerator: step.product.numerator, denominator: step.product.denominator });
    assert.equal(result.classification, 'valid');
    step = result.currentStep;
    result = session.recordResponse({ values: {
      wholeNumber: String(step.task.answer.whole),
      numerator: String(step.task.answer.numerator),
      denominator: String(step.task.answer.denominator),
      wholeNumberEnabled: true
    }});
    assert.equal(result.classification, 'valid');
  }
  assert.equal(session.getCurrentStep(), null);
  assert.deepEqual(session.getProgress(), {
    completedCount: 10, totalCount: 10, completedStepCount: 30, totalStepCount: 30,
    attemptCount: 30, isComplete: true
  });
});

test('guided division accepts a correct simplification entered beside the original mixed fraction', () => {
  const session = createFractionLikeDenominatorDivisionGuidedSession({ learnerKey: 'simplification-fields-learner', storage: memoryStorage(), tasks });
  let step = session.getCurrentStep();
  let result = session.recordResponse({ numerator: step.inverse.numerator, denominator: step.inverse.denominator });
  step = result.currentStep;
  result = session.recordResponse({ numerator: step.product.numerator, denominator: step.product.denominator });
  step = result.currentStep;
  result = session.recordResponse({ values: {
    wholeNumber: '1', numerator: '2', denominator: '5',
    wholeNumberEnabled: true
  }});
  assert.equal(result.classification, 'valid');

  step = result.currentStep;
  assert.equal(step.task.id, 'fraction-like-denominator-division-guided-02');
  result = session.recordResponse({ numerator: step.inverse.numerator, denominator: step.inverse.denominator });
  step = result.currentStep;
  assert.equal(step.stepId, 'multiply_fractions');
  result = session.recordResponse({ numerator: step.product.numerator, denominator: step.product.denominator });
  step = result.currentStep;
  assert.equal(step.stepId, 'simplify_quotient');
  assert.equal(step.product.numerator, 108);
  assert.equal(step.product.denominator, 72);
  result = session.recordResponse({ values: {
    wholeNumberEnabled: true,
    wholeNumber: '1',
    numerator: '36',
    denominator: '72',
    simplified: true,
    simplifiedNumerator: '1',
    simplifiedDenominator: '2'
  }});
  assert.equal(result.classification, 'valid');
  assert.equal(result.progress.completedCount, 2);
  assert.equal(result.progress.completedStepCount, 6);
});
