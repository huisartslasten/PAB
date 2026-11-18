import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_LIKE_DENOMINATOR_MULTIPLICATION_TASKS as tasks } from "./fraction-like-denominator-multiplication-task-bank.js";
import { createFractionLikeDenominatorMultiplicationSession } from "./fraction-like-denominator-multiplication-session.js";
import { greatestCommonDivisor } from "./fraction-answer-validation.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

test("the task bank contains fifteen unique like-denominator products of proper fractions", () => {
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => task.id)).size, 15);
  assert.equal(new Set(tasks.map(task => [
    task.leftFraction.numerator, task.leftFraction.denominator,
    task.rightFraction.numerator, task.rightFraction.denominator
  ].join("|"))).size, 15);
  assert.ok(tasks.every(task =>
    task.leftFraction.denominator === task.rightFraction.denominator &&
    task.leftFraction.numerator > 0 && task.leftFraction.numerator < task.leftFraction.denominator &&
    task.rightFraction.numerator > 0 && task.rightFraction.numerator < task.rightFraction.denominator &&
    task.result.numerator === task.leftFraction.numerator * task.rightFraction.numerator &&
    task.result.denominator === task.leftFraction.denominator * task.rightFraction.denominator
  ));
  const sourceExamples = new Set(["6|10|3|10", "7|8|4|8", "8|10|7|10", "5|7|5|7", "7|9|1|9"]);
  assert.ok(tasks.every(task => !sourceExamples.has([
    task.leftFraction.numerator, task.leftFraction.denominator,
    task.rightFraction.numerator, task.rightFraction.denominator
  ].join("|"))));
});

test("the practice validates products, requires reduction only when needed and resumes learner progress", () => {
  const storage = memoryStorage();
  const session = createFractionLikeDenominatorMultiplicationSession({ learnerKey: "Zyon", storage, tasks });
  assert.deepEqual(session.getCurrentTask().leftFraction, { numerator: 2, denominator: 3 });
  assert.deepEqual(session.getCurrentTask().rightFraction, { numerator: 1, denominator: 3 });
  assert.equal(session.recordAnswer({ numerator: "", denominator: "" }).classification, "invalid_input");
  assert.equal(session.recordAnswer({ numerator: "3", denominator: "9" }).classification, "incorrect_answer");
  assert.equal(session.recordAnswer({ numerator: "2", denominator: "9" }).classification, "valid");
  assert.equal(session.getProgress().completedCount, 1);
  assert.equal(session.getCurrentTask().taskNumber, 2);
  assert.equal(session.recordAnswer({ numerator: "6", denominator: "25" }).classification, "valid");
  assert.equal(session.getCurrentTask().taskNumber, 3);
  assert.equal(session.recordAnswer({ numerator: "15", denominator: "36" }).classification, "simplification_required");
  assert.equal(session.recordAnswer({
    numerator: "15", denominator: "36", simplified: true,
    simplifiedNumerator: "5", simplifiedDenominator: "12"
  }).classification, "valid");
  assert.equal(session.getCurrentTask().taskNumber, 5);
  const resumed = createFractionLikeDenominatorMultiplicationSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(resumed.getCurrentTask().taskNumber, 5);
});

test("all fifteen products can be completed and the round can be reset", () => {
  const storage = memoryStorage();
  const session = createFractionLikeDenominatorMultiplicationSession({ learnerKey: "complete", storage, tasks });
  for (let index = 0; index < tasks.length; index++) {
    const task = session.getCurrentTask();
    const divisor = greatestCommonDivisor(task.result.numerator, task.result.denominator);
    const reduced = divisor > 1;
    const result = session.recordAnswer({
      numerator: String(task.result.numerator),
      denominator: String(task.result.denominator),
      simplified: reduced,
      simplifiedNumerator: reduced ? String(task.result.numerator / divisor) : "",
      simplifiedDenominator: reduced ? String(task.result.denominator / divisor) : ""
    });
    assert.equal(result.classification, "valid", "task " + (index + 1));
  }
  assert.equal(session.getCurrentTask(), null);
  assert.deepEqual(session.getProgress(), { completedCount: 15, totalCount: 15, attemptCount: 15, isComplete: true });
  assert.throws(() => session.recordAnswer({ numerator: "1", denominator: "1" }), /complete/);
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber, 1);
});

test("invalid task banks are rejected rather than silently changed", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionLikeDenominatorMultiplicationSession({
    learnerKey: "x", storage, tasks: tasks.slice(0, 14)
  }), /Exactly 15/);
  assert.throws(() => createFractionLikeDenominatorMultiplicationSession({
    learnerKey: "x", storage,
    tasks: tasks.map((task, index) => index ? task : {
      ...task, rightFraction: { numerator: 1, denominator: 4 }
    })
  }), /same denominator/);
});
