import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_WHOLE_NUMBER_TIMES_PROPER_FRACTION_TASKS as tasks } from "./fraction-whole-number-times-proper-fraction-task-bank.js";
import { createFractionWholeNumberTimesProperFractionSession } from "./fraction-whole-number-times-proper-fraction-session.js";

function memoryStorage() {
  const values = new Map();
  return { getItem:key=>values.has(key)?values.get(key):null, setItem:(key,value)=>values.set(key,String(value)), removeItem:key=>values.delete(key) };
}

test("the task bank contains fifteen unique whole-number times proper-fraction tasks with integer quotients", () => {
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => task.id)).size, 15);
  assert.equal(new Set(tasks.map(task => [task.wholeNumber,task.numerator,task.denominator].join("|"))).size, 15);
  assert.ok(tasks.every(task =>
    task.wholeNumber > 0 &&
    task.numerator > 0 && task.numerator < task.denominator &&
    task.wholeNumber % task.denominator === 0 &&
    Number.isSafeInteger((task.wholeNumber / task.denominator) * task.numerator)
  ));
  const sourceExamples = new Set(["80|7|8","162|4|9","180|10|10","99|3|3","110|9|10"]);
  assert.ok(tasks.every(task => !sourceExamples.has([task.wholeNumber,task.numerator,task.denominator].join("|"))));
});

test("the practice validates answers and retains learner progress across session instances", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberTimesProperFractionSession({ learnerKey: "Zyon", storage, tasks });
  assert.deepEqual(
    { whole: session.getCurrentTask().wholeNumber, numerator: session.getCurrentTask().numerator, denominator: session.getCurrentTask().denominator },
    { whole: 36, numerator: 2, denominator: 3 }
  );
  assert.equal(session.recordAnswer({ answer: "" }).classification, "invalid_input");
  assert.equal(session.recordAnswer({ answer: "23" }).classification, "incorrect_answer");
  assert.equal(session.recordAnswer({ answer: "24" }).classification, "valid");
  assert.equal(session.getProgress().completedCount, 1);
  const resumed = createFractionWholeNumberTimesProperFractionSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(resumed.getCurrentTask().taskNumber, 2);
  assert.equal(resumed.recordAnswer({ answer: "36" }).classification, "valid");
  assert.equal(resumed.getCurrentTask().taskNumber, 3);
});

test("all fifteen tasks can be completed and the round can be reset", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberTimesProperFractionSession({ learnerKey: "complete", storage, tasks });
  for (let index = 0; index < 15; index++) {
    const task = session.getCurrentTask();
    assert.ok(task);
    assert.equal(session.recordAnswer({ answer: String(task.expectedAnswer) }).classification, "valid");
  }
  assert.equal(session.getCurrentTask(), null);
  assert.deepEqual(session.getProgress(), { completedCount: 15, totalCount: 15, attemptCount: 15, isComplete: true });
  assert.throws(() => session.recordAnswer({ answer: "1" }), /complete/);
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber, 1);
});

test("invalid task banks are rejected rather than silently changed", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionWholeNumberTimesProperFractionSession({ learnerKey: "x", storage, tasks: tasks.slice(0, 14) }), /Exactly 15/);
  assert.throws(() => createFractionWholeNumberTimesProperFractionSession({ learnerKey: "x", storage, tasks: tasks.map((task,index) => index ? task : { ...task, numerator: 3 }) }), /proper fraction/);
});
