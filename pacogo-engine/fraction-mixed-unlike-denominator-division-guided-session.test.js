import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_MIXED_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS as tasks } from "./fraction-mixed-unlike-denominator-division-guided-task-bank.js";
import { createFractionMixedUnlikeDenominatorDivisionGuidedSession } from "./fraction-mixed-unlike-denominator-division-guided-session.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}
function solveTask(session, task) {
  let result = session.recordResponse({ values: {
    leftNumerator: String(task.left.whole * task.left.denominator + task.left.numerator),
    leftDenominator: String(task.left.denominator),
    rightNumerator: String(task.right.whole * task.right.denominator + task.right.numerator),
    rightDenominator: String(task.right.denominator)
  }});
  assert.equal(result.classification, "valid");
  result = session.recordResponse({ values: { numerator: String(task.right.denominator), denominator: String(task.right.whole * task.right.denominator + task.right.numerator) }});
  assert.equal(result.classification, "valid");
  result = session.recordResponse({ values: {
    numerator: String((task.left.whole * task.left.denominator + task.left.numerator) * task.right.denominator),
    denominator: String(task.left.denominator * (task.right.whole * task.right.denominator + task.right.numerator))
  }});
  assert.equal(result.classification, "valid");
  const productNumerator = (task.left.whole * task.left.denominator + task.left.numerator) * task.right.denominator;
  const productDenominator = task.left.denominator * (task.right.whole * task.right.denominator + task.right.numerator);
  result = session.recordResponse({ values: {
    wholeNumber: String(Math.floor(productNumerator / productDenominator)),
    remainder: String(productNumerator % productDenominator)
  }});
  assert.equal(result.classification, "valid");
  result = session.recordResponse({ values: {
    wholeNumber: String(task.answer.whole),
    numerator: String(task.answer.numerator),
    denominator: String(task.answer.denominator)
  }});
  assert.equal(result.classification, "valid");
  return result;
}

test("the guided task bank contains ten unique, valid mixed-number divisions with unlike denominators", () => {
  assert.equal(tasks.length, 10);
  assert.equal(new Set(tasks.map(task => task.id)).size, 10);
  assert.equal(new Set(tasks.map(task => [task.left.whole,task.left.numerator,task.left.denominator,task.right.whole,task.right.numerator,task.right.denominator].join("|"))).size, 10);
  for (const task of tasks) {
    assert.notEqual(task.left.denominator, task.right.denominator);
    assert.ok(task.left.whole > 0 && task.left.numerator > 0 && task.left.numerator < task.left.denominator);
    assert.ok(task.right.whole > 0 && task.right.numerator > 0 && task.right.numerator < task.right.denominator);
    const left = task.left.whole * task.left.denominator + task.left.numerator;
    const right = task.right.whole * task.right.denominator + task.right.numerator;
    const n = left * task.right.denominator;
    const d = task.left.denominator * right;
    assert.ok(left * task.right.denominator > right * task.left.denominator);
    assert.equal(Math.floor(n / d), task.answer.whole);
    assert.equal((n % d) * task.answer.denominator, task.answer.numerator * d);
    assert.equal((task.answer.whole * task.answer.denominator + task.answer.numerator) * d, n * task.answer.denominator);
  }
});

test("the five guided steps validate in order and retain prior completed steps", () => {
  const session = createFractionMixedUnlikeDenominatorDivisionGuidedSession({ learnerKey: "guided-learner", storage: memoryStorage(), tasks });
  let step = session.getCurrentStep();
  assert.equal(step.stepId, "convert_mixed_numbers");
  let result = solveTask(session, tasks[0]);
  assert.equal(result.progress.completedStepCount, 5);
  assert.equal(result.progress.completedCount, 1);
  assert.equal(result.currentStep.taskNumber, 2);
  assert.equal(result.currentStep.stepNumber, 1);
  assert.deepEqual(result.currentStep.completedStepIds, []);
});

test("all ten guided tasks complete in fifty correct steps and can be restarted", () => {
  const storage = memoryStorage();
  const session = createFractionMixedUnlikeDenominatorDivisionGuidedSession({ learnerKey: "complete-learner", storage, tasks });
  for (const task of tasks) solveTask(session, task);
  assert.equal(session.getCurrentStep(), null);
  assert.deepEqual(session.getProgress(), {
    completedCount: 10, totalCount: 10, completedStepCount: 50, totalStepCount: 50, attemptCount: 50, isComplete: true
  });
  session.reset();
  assert.equal(session.getCurrentStep().taskNumber, 1);
  assert.equal(session.getCurrentStep().stepNumber, 1);
});

test("incorrect answers do not unlock the next guided step", () => {
  const session = createFractionMixedUnlikeDenominatorDivisionGuidedSession({ learnerKey: "incorrect-learner", storage: memoryStorage(), tasks });
  const result = session.recordResponse({ values: { leftNumerator: "1", leftDenominator: "2", rightNumerator: "1", rightDenominator: "2" }});
  assert.equal(result.classification, "incorrect_answer");
  assert.equal(result.currentStep.stepId, "convert_mixed_numbers");
  assert.equal(result.progress.completedStepCount, 0);
});
