import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_WHOLE_NUMBER_TIMES_MIXED_FRACTION_GREATER_THAN_ONE_TASKS as tasks } from "./fraction-whole-number-times-mixed-fraction-greater-than-one-task-bank.js";
import { createFractionWholeNumberTimesMixedFractionGreaterThanOneSession } from "./fraction-whole-number-times-mixed-fraction-greater-than-one-session.js";

function memoryStorage() {
  const values = new Map();
  return { getItem:key=>values.has(key)?values.get(key):null, setItem:(key,value)=>values.set(key,String(value)), removeItem:key=>values.delete(key) };
}

test("the fifteen tasks are unique, use mixed multipliers greater than one, and have correct simplified mixed answers", () => {
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => task.id)).size, 15);
  assert.equal(new Set(tasks.map(task => [task.wholeNumber,task.multiplier.whole,task.multiplier.numerator,task.multiplier.denominator].join("|"))).size, 15);
  const sourceExamples = new Set(["6|3|6|7","9|5|7|9","9|1|7|9","9|8|6|9","7|4|8|9"]);
  for (const task of tasks) {
    assert.ok(task.wholeNumber > 0);
    assert.ok(task.multiplier.whole >= 1);
    assert.ok(task.multiplier.numerator > 0 && task.multiplier.numerator < task.multiplier.denominator);
    assert.ok(task.answer.whole > 0);
    assert.ok(task.answer.numerator > 0 && task.answer.numerator < task.answer.denominator);
    assert.equal(sourceExamples.has([task.wholeNumber,task.multiplier.whole,task.multiplier.numerator,task.multiplier.denominator].join("|")), false);
    const left = task.wholeNumber * (task.multiplier.whole * task.multiplier.denominator + task.multiplier.numerator) * task.answer.denominator;
    const right = (task.answer.whole * task.answer.denominator + task.answer.numerator) * task.multiplier.denominator;
    assert.equal(left, right);
  }
});

test("answers are checked as mixed numbers and learner progress resumes independently", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberTimesMixedFractionGreaterThanOneSession({ learnerKey: "Zyon", storage, tasks });
  assert.deepEqual(session.getCurrentTask().multiplier, { whole: 1, numerator: 2, denominator: 5 });
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: false, wholeNumber: "", numerator: "1", denominator: "5" } }).classification, "invalid_input");
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "4", numerator: "2", denominator: "10" } }).classification, "incorrect_answer");
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "4", numerator: "1", denominator: "10" } }).classification, "requires_simplification");
  assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "4", numerator: "2", denominator: "10", simplified: true, simplifiedNumerator: "1", simplifiedDenominator: "5" } }).classification, "valid");
  assert.equal(session.getProgress().completedCount, 1);
  const resumed = createFractionWholeNumberTimesMixedFractionGreaterThanOneSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(resumed.getCurrentTask().taskNumber, 2);
  assert.equal(resumed.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "9", numerator: "1", denominator: "3" } }).classification, "valid");
  assert.equal(resumed.getCurrentTask().taskNumber, 3);
});

test("all fifteen tasks complete and reset correctly", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberTimesMixedFractionGreaterThanOneSession({ learnerKey: "complete", storage, tasks });
  for (const task of tasks) {
    assert.equal(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: String(task.answer.whole), numerator: String(task.answer.numerator), denominator: String(task.answer.denominator) } }).classification, "valid");
  }
  assert.equal(session.getCurrentTask(), null);
  assert.deepEqual(session.getProgress(), { completedCount: 15, totalCount: 15, attemptCount: 15, isComplete: true });
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber, 1);
});

test("invalid task banks and wrong task answers are rejected", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionWholeNumberTimesMixedFractionGreaterThanOneSession({ learnerKey: "x", storage, tasks: tasks.slice(0,14) }), /Exactly 15/);
  assert.throws(() => createFractionWholeNumberTimesMixedFractionGreaterThanOneSession({ learnerKey: "x", storage, tasks: tasks.map((task,index) => index ? task : { ...task, answer: { whole: 4, numerator: 2, denominator: 5 } }) }), /incorrect answer/);
});
