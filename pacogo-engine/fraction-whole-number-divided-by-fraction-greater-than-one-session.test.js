import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_WHOLE_NUMBER_DIVIDED_BY_FRACTION_GREATER_THAN_ONE_TASKS as tasks } from "./fraction-whole-number-divided-by-fraction-greater-than-one-task-bank.js";
import { createFractionWholeNumberDividedByFractionGreaterThanOneSession } from "./fraction-whole-number-divided-by-fraction-greater-than-one-session.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

test("the fifteen division tasks are unique and have correct simplified mixed-number answers", () => {
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => task.id)).size, 15);
  assert.equal(new Set(tasks.map(task => [task.wholeNumber, task.divisor.whole, task.divisor.numerator, task.divisor.denominator].join("|"))).size, 15);
  const sourceExamples = new Set(["10|2|4|7", "7|6|3|4", "9|2|9|10"]);
  for (const task of tasks) {
    assert.ok(task.wholeNumber > 0);
    assert.ok(task.divisor.whole >= 1);
    assert.ok(task.divisor.numerator > 0 && task.divisor.numerator < task.divisor.denominator);
    assert.ok(task.answer.whole >= 1);
    assert.ok(task.answer.numerator > 0 && task.answer.numerator < task.answer.denominator);
    assert.equal(sourceExamples.has([task.wholeNumber, task.divisor.whole, task.divisor.numerator, task.divisor.denominator].join("|")), false);
    const dividend = task.wholeNumber * task.divisor.denominator * task.answer.denominator;
    const quotient = (task.answer.whole * task.answer.denominator + task.answer.numerator) *
      (task.divisor.whole * task.divisor.denominator + task.divisor.numerator);
    assert.equal(dividend, quotient);
  }
});

test("answers are checked as simplified mixed numbers and learner progress resumes independently", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberDividedByFractionGreaterThanOneSession({ learnerKey: "Zyon", storage, tasks });
  assert.deepEqual(session.getCurrentTask().divisor, { whole: 2, numerator: 1, denominator: 4 });
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: false, numerator: "1", denominator: "3" } }).classification, "invalid_input");
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "5", numerator: "2", denominator: "5" } }).classification, "incorrect_answer");
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "5", numerator: "2", denominator: "6" } }).classification, "requires_simplification");
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "5", numerator: "2", denominator: "6", simplified: true, simplifiedNumerator: "1", simplifiedDenominator: "3" } }).classification, "valid");
  assert.equal(session.getProgress().completedCount, 1);
  const resumed = createFractionWholeNumberDividedByFractionGreaterThanOneSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(resumed.getCurrentTask().taskNumber, 2);
  const next = resumed.getCurrentTask().answer;
  assert.equal(resumed.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: String(next.whole), numerator: String(next.numerator), denominator: String(next.denominator) } }).classification, "valid");
  assert.equal(resumed.getCurrentTask().taskNumber, 3);
});

test("all fifteen tasks complete and reset correctly", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberDividedByFractionGreaterThanOneSession({ learnerKey: "complete", storage, tasks });
  for (const task of tasks) {
    assert.equal(session.recordAnswer({ values: {
      wholeNumberEnabled: true,
      wholeNumber: String(task.answer.whole),
      numerator: String(task.answer.numerator),
      denominator: String(task.answer.denominator)
    } }).classification, "valid");
  }
  assert.equal(session.getCurrentTask(), null);
  assert.deepEqual(session.getProgress(), { completedCount: 15, totalCount: 15, attemptCount: 15, isComplete: true });
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber, 1);
});

test("invalid task banks and incorrect answers are rejected", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionWholeNumberDividedByFractionGreaterThanOneSession({ learnerKey: "x", storage, tasks: tasks.slice(0, 14) }), /Exactly 15/);
  assert.throws(() => createFractionWholeNumberDividedByFractionGreaterThanOneSession({
    learnerKey: "x", storage,
    tasks: tasks.map((task, index) => index ? task : { ...task, answer: { whole: 4, numerator: 1, denominator: 3 } })
  }), /incorrect answer/);
});
