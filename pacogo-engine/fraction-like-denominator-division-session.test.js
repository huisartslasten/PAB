import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS as tasks } from "./fraction-like-denominator-division-task-bank.js";
import { createFractionLikeDenominatorDivisionSession } from "./fraction-like-denominator-division-session.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

test("the task bank contains fifteen unique like-denominator divisions of proper fractions with exact mixed answers", () => {
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => task.id)).size, 15);
  assert.equal(new Set(tasks.map(task => [
    task.left.numerator, task.left.denominator, task.right.numerator, task.right.denominator
  ].join("|"))).size, 15);
  for (const task of tasks) {
    assert.equal(task.left.denominator, task.right.denominator);
    assert.ok(task.left.numerator > 0 && task.left.numerator < task.left.denominator);
    assert.ok(task.right.numerator > 0 && task.right.numerator < task.right.denominator);
    assert.ok(task.left.numerator > task.right.numerator);
    assert.equal(
      task.left.numerator * task.answer.denominator,
      (task.answer.whole * task.answer.denominator + task.answer.numerator) * task.right.numerator
    );
  }
});

test("the session validates simplified mixed answers and advances only after a correct answer", () => {
  const storage = memoryStorage();
  const session = createFractionLikeDenominatorDivisionSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(session.getCurrentTask().taskNumber, 1);
  assert.equal(session.recordAnswer({ values: {
    wholeNumberEnabled: true, wholeNumber: "1", numerator: "2", denominator: "6"
  } }).classification, "requires_simplification");
  assert.equal(session.getCurrentTask().taskNumber, 1);
  assert.equal(session.recordAnswer({ values: {
    wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "3"
  } }).classification, "valid");
  assert.equal(session.getCurrentTask().taskNumber, 2);
  const resumed = createFractionLikeDenominatorDivisionSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(resumed.getCurrentTask().taskNumber, 2);
});

test("all fifteen tasks can be completed and the session can be restarted", () => {
  const storage = memoryStorage();
  const session = createFractionLikeDenominatorDivisionSession({ learnerKey: "complete", storage, tasks });
  for (const [index, task] of tasks.entries()) {
    const result = session.recordAnswer({ values: {
      wholeNumberEnabled: true,
      wholeNumber: String(task.answer.whole),
      numerator: String(task.answer.numerator),
      denominator: String(task.answer.denominator)
    } });
    assert.equal(result.classification, "valid", "task " + (index + 1));
  }
  assert.equal(session.getCurrentTask(), null);
  assert.deepEqual(session.getProgress(), {
    completedCount: 15, totalCount: 15, attemptCount: 15, isComplete: true
  });
  assert.throws(() => session.recordAnswer({ values: {} }), /complete/);
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber, 1);
});

test("invalid task banks are rejected rather than silently changed", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionLikeDenominatorDivisionSession({
    learnerKey: "x", storage, tasks: tasks.slice(0, 14)
  }), /Exactly 15/);
});
