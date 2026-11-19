import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_MIXED_UNLIKE_DENOMINATOR_DIVISION_TASKS as tasks } from "./fraction-mixed-unlike-denominator-division-task-bank.js";
import { createFractionMixedUnlikeDenominatorDivisionSession } from "./fraction-mixed-unlike-denominator-division-session.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

test("the bank contains fifteen unique divisions of mixed numbers greater than one with unlike denominators and exact simplified answers", () => {
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => task.id)).size, 15);
  assert.equal(new Set(tasks.map(task => [task.left.whole,task.left.numerator,task.left.denominator,task.right.whole,task.right.numerator,task.right.denominator].join("|")).size, 15);
  for (const task of tasks) {
    assert.ok(task.left.whole >= 1 && task.right.whole >= 1);
    assert.notEqual(task.left.denominator, task.right.denominator);
    assert.ok(task.left.numerator > 0 && task.left.numerator < task.left.denominator);
    assert.ok(task.right.numerator > 0 && task.right.numerator < task.right.denominator);
    const left = task.left.whole * task.left.denominator + task.left.numerator;
    const right = task.right.whole * task.right.denominator + task.right.numerator;
    const answer = task.answer.whole * task.answer.denominator + task.answer.numerator;
    assert.ok(left * task.right.denominator > right * task.left.denominator);
    assert.equal(left * task.right.denominator * task.answer.denominator,
      answer * right * task.left.denominator);
  }
});

test("the session validates simplified mixed answers and advances only after a correct answer", () => {
  const storage = memoryStorage();
  const session = createFractionMixedUnlikeDenominatorDivisionSession({ learnerKey: "Zyon", storage, tasks });
  const first = tasks[0];
  assert.equal(session.getCurrentTask().taskNumber, 1);
  assert.equal(session.recordAnswer({ values: {
    wholeNumberEnabled: true, wholeNumber: "1", numerator: "2", denominator: "6"
  } }).classification, "requires_simplification");
  assert.equal(session.getCurrentTask().taskNumber, 1);
  assert.equal(session.recordAnswer({ values: {
    wholeNumberEnabled: true, wholeNumber: String(first.answer.whole),
    numerator: String(first.answer.numerator), denominator: String(first.answer.denominator)
  } }).classification, "valid");
  assert.equal(session.getCurrentTask().taskNumber, 2);
  assert.equal(createFractionMixedUnlikeDenominatorDivisionSession({ learnerKey: "Zyon", storage, tasks }).getCurrentTask().taskNumber, 2);
});

test("all fifteen tasks can be completed and the test can be restarted", () => {
  const storage = memoryStorage();
  const session = createFractionMixedUnlikeDenominatorDivisionSession({ learnerKey: "complete", storage, tasks });
  for (const [index, task] of tasks.entries()) {
    const result = session.recordAnswer({ values: {
      wholeNumberEnabled: true, wholeNumber: String(task.answer.whole),
      numerator: String(task.answer.numerator), denominator: String(task.answer.denominator)
    } });
    assert.equal(result.classification, "valid", "task " + (index + 1));
  }
  assert.equal(session.getCurrentTask(), null);
  assert.deepEqual(session.getProgress(), { completedCount: 15, totalCount: 15, attemptCount: 15, isComplete: true });
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber, 1);
});

test("invalid task bank lengths and equal denominators are rejected", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionMixedUnlikeDenominatorDivisionSession({ learnerKey: "x", storage, tasks: tasks.slice(0, 14) }), /Exactly 15/);
  assert.throws(() => createFractionMixedUnlikeDenominatorDivisionSession({
    learnerKey: "x", storage, tasks: tasks.map((task, index) => index ? task : {
      ...task, right: { ...task.right, denominator: task.left.denominator }
    })
  }), /unlike denominators/);
});
