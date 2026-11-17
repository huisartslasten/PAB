import test from "node:test";
import assert from "node:assert/strict";
import { createFractionQuantitySubtractionSession } from "./fraction-quantity-subtraction-session.js";

function createTasks(firstTask = {}) {
  return Array.from({ length: 10 }, (_, index) => ({
    id: "visual-subtraction-" + (index + 1),
    wholeUnits: 2,
    subtraction: { whole: 0, numerator: 1, denominator: 2 },
    ...((index === 0) ? firstTask : {})
  }));
}

test("creates a ten-task session with one fixed representation and a fresh shared quantity controller", () => {
  const session = createFractionQuantitySubtractionSession({
    tasks: createTasks(),
    representation: "bar"
  });
  assert.equal(session.representation, "bar");
  assert.equal(session.getCurrentTask().taskNumber, 1);
  assert.equal(session.getCurrentTask().totalTasks, 10);
  assert.equal("expectedRemaining" in session.getCurrentTask(), false, "the learner-facing task contract must not expose the answer");
  assert.equal(session.getController().getState().amount.whole, 2);
  assert.deepEqual(session.getProgress(), {
    completedTaskCount: 0, totalTaskCount: 10, currentTaskNumber: 1, attemptCount: 0, isComplete: false
  });
});

test("checks the exact remaining quantity and requires an explicit advance after a correct answer", () => {
  const session = createFractionQuantitySubtractionSession({ tasks: createTasks() });
  const controller = session.getController();
  assert.equal(session.check().correct, false);
  assert.throws(() => session.advance(), /successful current-task check is required/);

  controller.selectUnit("unit-1");
  controller.divideSelectedUnit(2);
  controller.toggleSegment("unit-1", 0);
  assert.equal(session.getLastCheck(), null, "a changed model invalidates the previous check");
  assert.equal(session.check().correct, true);
  const next = session.advance();
  assert.equal(next.currentTask.taskNumber, 2);
  assert.equal(next.progress.completedTaskCount, 1);
  assert.equal(session.getController().getState().amount.whole, 2);
});

test("supports whole-unit and fractional subtraction quantities", () => {
  const tasks = createTasks({
    wholeUnits: 3,
    subtraction: { whole: 1, numerator: 1, denominator: 2 }
  });
  const session = createFractionQuantitySubtractionSession({ tasks });
  const controller = session.getController();
  controller.setUnitFilled("unit-1", false);
  controller.selectUnit("unit-2");
  controller.divideSelectedUnit(2);
  controller.toggleSegment("unit-2", 0);
  assert.equal(session.check().correct, true);
});

test("compares equivalent rational values exactly across denominators", () => {
  const tasks = createTasks({
    wholeUnits: 2,
    subtraction: { whole: 0, numerator: 1, denominator: 3 }
  });
  const session = createFractionQuantitySubtractionSession({ tasks, allowedDivisions: [2, 3] });
  const controller = session.getController();
  controller.selectUnit("unit-1");
  controller.divideSelectedUnit(3);
  controller.toggleSegment("unit-1", 0);
  assert.equal(session.check().correct, true);
});

test("requires exactly ten unique, valid tasks and a supported single representation", () => {
  assert.throws(() => createFractionQuantitySubtractionSession({ tasks: createTasks().slice(0, 9) }), /Exactly 10/);
  assert.throws(() => createFractionQuantitySubtractionSession({
    tasks: createTasks().map(task => ({ ...task, id: "duplicate" }))
  }), /unique/);
  assert.throws(() => createFractionQuantitySubtractionSession({
    tasks: createTasks({ subtraction: { whole: 0, numerator: 1, denominator: 5 } })
  }), /denominator that is not enabled/);
  assert.throws(() => createFractionQuantitySubtractionSession({
    tasks: createTasks({ wholeUnits: 1, subtraction: { whole: 1, numerator: 0, denominator: 1 } })
  }), /less than the starting quantity/);
  assert.throws(() => createFractionQuantitySubtractionSession({
    tasks: createTasks(), representation: "pie-and-bar"
  }), /pie or bar/);
});

test("does not allow checking or advancing after all ten tasks are complete", () => {
  const tasks = createTasks();
  const session = createFractionQuantitySubtractionSession({ tasks });
  for (let index = 0; index < 10; index += 1) {
    const controller = session.getController();
    controller.selectUnit("unit-1");
    controller.divideSelectedUnit(2);
    controller.toggleSegment("unit-1", 0);
    assert.equal(session.check().correct, true);
    session.advance();
  }
  assert.equal(session.getProgress().isComplete, true);
  assert.equal(session.getCurrentTask(), null);
  assert.equal(session.getController(), null);
  assert.throws(() => session.check(), /complete/);
  assert.throws(() => session.advance(), /complete/);
  assert.equal(session.getResults().filter(result => result.completed).length, 10);
});
