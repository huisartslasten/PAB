import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK as bank } from "./fraction-quantity-whole-minus-greater-than-one-task-bank.js";
import { createFractionQuantitySubtractionSession } from "./fraction-quantity-subtraction-session.js";

test("central bank contains ten tasks of only whole number minus a fraction greater than one", () => {
  assert.equal(bank.tasks.length, 10);
  assert.equal(bank.defaultRepresentation, "bar");
  assert.deepEqual(bank.allowedDivisions, [2, 3, 4]);
  assert.deepEqual(bank.tasks.map(task => task.representation), ["bar", "pie", "bar", "pie", "bar", "pie", "bar", "pie", "bar", "pie"]);
  const ids = new Set();
  for (const task of bank.tasks) {
    assert.equal(ids.has(task.id), false);
    ids.add(task.id);
    assert.ok(task.wholeUnits >= 2);
    assert.ok(task.subtraction.whole >= 1, "the subtracted fraction must be greater than one");
    assert.ok(task.subtraction.numerator > 0);
    assert.ok(bank.allowedDivisions.includes(task.subtraction.denominator));
    const subtracted = task.subtraction.whole + task.subtraction.numerator / task.subtraction.denominator;
    assert.ok(subtracted > 1);
    assert.ok(subtracted < task.wholeUnits);
  }
});

test("the ten approved tasks are accepted by the shared quantity subtraction session", () => {
  const session = createFractionQuantitySubtractionSession({
    tasks: bank.tasks,
    representation: bank.defaultRepresentation,
    allowedDivisions: bank.allowedDivisions
  });
  assert.equal(session.getProgress().totalTaskCount, 10);
  assert.equal(session.getCurrentTask().subtraction.whole, 1);
  assert.equal(session.getCurrentTask().subtraction.numerator, 1);
  assert.equal(session.getCurrentTask().subtraction.denominator, 2);
});

test("the task bank excludes the other two subtraction exercise types", () => {
  for (const task of bank.tasks) {
    assert.ok(task.subtraction.whole >= 1);
    assert.notEqual(task.subtraction.numerator, 0);
  }
});
