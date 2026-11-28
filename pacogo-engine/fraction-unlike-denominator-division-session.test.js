import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS } from "./fraction-unlike-denominator-division-task-bank.js";
import { createFractionUnlikeDenominatorDivisionSession } from "./fraction-unlike-denominator-division-session.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}
function answerValues(answer) {
  return {
    wholeNumberEnabled: true,
    wholeNumber: String(answer.whole),
    numerator: String(answer.numerator),
    denominator: String(answer.denominator),
    simplified: false,
    simplifiedNumerator: "",
    simplifiedDenominator: ""
  };
}

test("unlike-denominator division bank has 15 unique proper-fraction questions and exact simplified answers", () => {
  assert.equal(FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS.length, 15);
  assert.equal(new Set(FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS.map(task => task.id)).size, 15);
  assert.equal(new Set(FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS.map(task =>
    [task.left.numerator, task.left.denominator, task.right.numerator, task.right.denominator].join("/")
  )).size, 15);
  for (const task of FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS) {
    assert.ok(task.left.numerator < task.left.denominator);
    assert.ok(task.right.numerator < task.right.denominator);
    assert.notEqual(task.left.denominator, task.right.denominator);
    assert.ok(task.answer.whole >= 1);
    assert.equal(task.left.numerator * task.right.denominator * task.answer.denominator,
      (task.answer.whole * task.answer.denominator + task.answer.numerator) * task.left.denominator * task.right.numerator);
  }
});

test("session validates answers, advances through 15 tasks, persists progress and restarts", () => {
  const storage = createStorage();
  const session = createFractionUnlikeDenominatorDivisionSession({
    learnerKey: "Zyon", storage, tasks: FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS
  });
  assert.equal(session.getCurrentTask().taskNumber, 1);
  for (const task of FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS) {
    const result = session.recordAnswer({ values: answerValues(task.answer) });
    assert.equal(result.classification, "valid");
  }
  assert.equal(session.getProgress().completedCount, 15);
  assert.equal(session.getProgress().isComplete, true);
  assert.equal(session.getCurrentTask(), null);
  const restored = createFractionUnlikeDenominatorDivisionSession({
    learnerKey: "Zyon", storage, tasks: FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS
  });
  assert.equal(restored.getProgress().completedCount, 15);
  restored.reset();
  assert.equal(restored.getCurrentTask().taskNumber, 1);
});

test("session distinguishes incorrect, unsimplified and incomplete answers", () => {
  const session = createFractionUnlikeDenominatorDivisionSession({
    learnerKey: "learner", storage: createStorage(), tasks: FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS
  });
  assert.equal(session.recordAnswer({ values: { ...answerValues(FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS[0].answer), denominator: "" } }).classification, "invalid_input");
  assert.equal(session.recordAnswer({ values: { ...answerValues(FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS[0].answer), wholeNumber: "0" } }).classification, "incorrect_answer");
  assert.equal(session.getProgress().completedCount, 0);
});
