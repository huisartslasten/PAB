import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_MIXED_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS as tasks } from "./fraction-mixed-unlike-denominator-multiplication-task-bank.js";
import { createFractionMixedUnlikeDenominatorMultiplicationSession } from "./fraction-mixed-unlike-denominator-multiplication-session.js";
import { greatestCommonDivisor } from "./fraction-answer-validation.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

test("the bank contains fifteen unique mixed-number products with unlike denominators", () => {
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => task.id)).size, 15);
  assert.equal(new Set(tasks.map(task => [
    task.left.whole,task.left.numerator,task.left.denominator,
    task.right.whole,task.right.numerator,task.right.denominator
  ].join("|"))).size, 15);
  assert.ok(tasks.every(task =>
    task.left.whole >= 1 && task.right.whole >= 1 &&
    task.left.denominator !== task.right.denominator &&
    task.left.numerator > 0 && task.left.numerator < task.left.denominator &&
    task.right.numerator > 0 && task.right.numerator < task.right.denominator
  ));
  const screenshotExamples = new Set([
    "4|7|8|2|9|10","5|7|9|3|3|7","7|8|10|6|7|8",
    "7|3|4|2|4|9","5|5|7|5|7|10"
  ]);
  assert.ok(tasks.every(task => !screenshotExamples.has([
    task.left.whole,task.left.numerator,task.left.denominator,
    task.right.whole,task.right.numerator,task.right.denominator
  ].join("|"))));
  assert.ok(tasks.some(task => greatestCommonDivisor(task.result.numerator,task.result.denominator) > 1) === false);
  assert.ok(tasks.every(task => {
    const numerator = (task.left.whole * task.left.denominator + task.left.numerator) *
      (task.right.whole * task.right.denominator + task.right.numerator);
    const denominator = task.left.denominator * task.right.denominator;
    const whole = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    const divisor = greatestCommonDivisor(remainder, denominator);
    return remainder > 0 &&
      task.result.whole === whole &&
      task.result.numerator === remainder / divisor &&
      task.result.denominator === denominator / divisor;
  }));
});

test("answers, required simplification and learner progress are validated", () => {
  const storage = memoryStorage();
  const session = createFractionMixedUnlikeDenominatorMultiplicationSession({ learnerKey: "Zyon", storage, tasks });
  assert.deepEqual(session.getCurrentTask().left, { whole: 2, numerator: 1, denominator: 3 });
  assert.deepEqual(session.getCurrentTask().right, { whole: 1, numerator: 2, denominator: 5 });
  assert.equal(session.recordAnswer({ wholeNumberEnabled: true, wholeNumber: "", numerator: "4", denominator: "15" }).classification, "invalid_input");
  assert.equal(session.recordAnswer({ wholeNumberEnabled: true, wholeNumber: "3", numerator: "8", denominator: "30" }).classification, "simplification_required");
  assert.equal(session.recordAnswer({
    wholeNumberEnabled: true, wholeNumber: "3", numerator: "8", denominator: "30",
    simplified: true, simplifiedNumerator: "4", simplifiedDenominator: "15"
  }).classification, "valid");
  assert.equal(session.getCurrentTask().taskNumber, 2);
  const second = tasks[1];
  assert.equal(session.recordAnswer({
    wholeNumberEnabled: true, wholeNumber: String(second.result.whole),
    numerator: String(second.result.numerator), denominator: String(second.result.denominator)
  }).classification, "valid");
  const resumed = createFractionMixedUnlikeDenominatorMultiplicationSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(resumed.getCurrentTask().taskNumber, 3);
});

test("all fifteen tasks can be completed and the round reset", () => {
  const storage = memoryStorage();
  const session = createFractionMixedUnlikeDenominatorMultiplicationSession({ learnerKey: "complete", storage, tasks });
  for (let index = 0; index < tasks.length; index += 1) {
    const task = session.getCurrentTask();
    const result = session.recordAnswer({
      wholeNumberEnabled: true,
      wholeNumber: String(task.result.whole),
      numerator: String(task.result.numerator),
      denominator: String(task.result.denominator)
    });
    assert.equal(result.classification, "valid", "task " + (index + 1));
  }
  assert.equal(session.getCurrentTask(), null);
  assert.deepEqual(session.getProgress(), {
    completedCount: 15, totalCount: 15, attemptCount: 15, isComplete: true
  });
  assert.throws(() => session.recordAnswer({ wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "2" }), /complete/);
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber, 1);
});

test("incorrect products, invalid task banks and incorrect supplied results are rejected", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionMixedUnlikeDenominatorMultiplicationSession({
    learnerKey: "x", storage, tasks: tasks.slice(0, 14)
  }), /Exactly 15/);
  assert.throws(() => createFractionMixedUnlikeDenominatorMultiplicationSession({
    learnerKey: "x", storage, tasks: tasks.map((task, index) => index ? task : {
      ...task, right: { ...task.right, denominator: task.left.denominator }
    })
  }), /unlike denominators/);
  assert.throws(() => createFractionMixedUnlikeDenominatorMultiplicationSession({
    learnerKey: "x", storage, tasks: tasks.map((task, index) => index ? task : {
      ...task, result: { ...task.result, numerator: task.result.numerator + 1 }
    })
  }), /incorrect mixed-number product/);
});
