import assert from "node:assert/strict";
import { createFractionAdditionPracticeSession } from "./fraction-addition-practice-session.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    entries: () => [...values.entries()]
  };
}

function completeCurrentTask(session, answers) {
  for (const answer of answers) assert.equal(session.recordResponse({ rawValue: String(answer) }).classification, "valid");
}

const storage = createMemoryStorage();
const learnerA = createFractionAdditionPracticeSession({ learnerKey: "learner-a", storage });
const learnerB = createFractionAdditionPracticeSession({ learnerKey: "learner-b", storage });
assert.equal(learnerA.getCurrentStep().stepId, "common_denominator");
assert.equal(learnerA.getCurrentStep().stepNumber, 1);
assert.equal(learnerA.getCurrentStep().expression, "1/3 + 1/4 → noemer ?");
assert.deepEqual(learnerA.getCurrentStep().leftFraction, { numerator: 1, denominator: 3 });
assert.deepEqual(learnerA.getCurrentStep().rightFraction, { numerator: 1, denominator: 4 });
assert.equal(learnerA.getCurrentStep().operationSymbol, "+");
assert.equal(learnerA.getCurrentStep().taskNumber, 1);
assert.equal(learnerA.getCurrentStep().totalTasks, 1);
assert.equal(learnerA.recordResponse({ rawValue: "6" }).classification, "not_common_denominator");
assert.equal(learnerA.getCurrentStep().stepId, "common_denominator");
assert.equal(learnerA.recordResponse({ rawValue: "12" }).classification, "valid");
assert.equal(learnerA.getCurrentStep().expression, "1/3 = ?/12");
assert.equal(learnerA.recordResponse({ rawValue: "3" }).classification, "not_equivalent");
assert.equal(learnerA.getCurrentStep().stepId, "left_equivalent_numerator");
assert.equal(learnerA.recordResponse({ rawValue: "4" }).classification, "valid");
assert.equal(learnerA.getCurrentStep().expression, "1/4 = ?/12");
assert.equal(learnerA.recordResponse({ rawValue: "3" }).classification, "valid");
assert.equal(learnerA.getCurrentStep().expression, "4/12 + 3/12 = ?/12");
assert.equal(learnerA.recordResponse({ rawValue: "8" }).classification, "arithmetic_error");
assert.equal(learnerA.getCurrentStep().stepId, "addition_result");
const done = learnerA.recordResponse({ rawValue: "7" });
assert.equal(done.classification, "valid");
assert.equal(done.progress.isComplete, true);
assert.deepEqual(done.completion, {
  taskId: "fraction-addition-practice-01",
  taskNumber: 1, totalTasks: 1,
  leftFraction: { numerator: 1, denominator: 3 },
  rightFraction: { numerator: 1, denominator: 4 },
  operationSymbol: "+",
  leftNumerator: 4, rightNumerator: 3, resultNumerator: 7, denominator: 12
});
assert.equal(learnerA.getCurrentStep(), null);
assert.equal(learnerB.getProgress().completedStepCount, 0);
const [key, value] = storage.entries()[0];
assert.match(key, /pacogo:fraction-addition-practice:v1:learner-a/);
assert.equal(value.includes('"rawValue":"6"'), true);
assert.equal(value.includes('"rawValue":"12"'), true);
assert.equal(value.includes('"rawValue":"8"'), true);
assert.equal(value.includes("learner-a"), false);
assert.throws(() => createFractionAdditionPracticeSession({ learnerKey: " ", storage }), /learner key/);
assert.throws(() => createFractionAdditionPracticeSession({ learnerKey: "learner-a" }), /local storage/);
learnerA.reset();
assert.equal(learnerA.getProgress().completedStepCount, 0);
assert.equal(learnerB.getProgress().completedStepCount, 0);

// A configured session advances through multiple independently defined tasks.
const configuredTasks = [
  {
    id: "addition-a",
    leftFraction: { numerator: 1, denominator: 3 },
    rightFraction: { numerator: 1, denominator: 4 }
  },
  {
    id: "addition-b",
    leftFraction: { numerator: 2, denominator: 5 },
    rightFraction: { numerator: 1, denominator: 10 }
  }
];
const configured = createFractionAdditionPracticeSession({
  learnerKey: "learner-configured", storage, tasks: configuredTasks
});
assert.equal(configured.getProgress().totalTaskCount, 2);
assert.equal(configured.getProgress().totalStepCount, 8);
assert.equal(configured.getCurrentStep().taskId, "addition-a");
completeCurrentTask(configured, [12, 4, 3, 7]);
assert.equal(configured.getCurrentStep().taskId, "addition-b");
assert.equal(configured.getCurrentStep().taskNumber, 2);
assert.equal(configured.getCurrentStep().expression, "2/5 + 1/10 → noemer ?");
assert.deepEqual(configured.getCurrentStep().leftFraction, { numerator: 2, denominator: 5 });
assert.deepEqual(configured.getCurrentStep().rightFraction, { numerator: 1, denominator: 10 });
assert.equal(configured.recordResponse({ rawValue: "6" }).classification, "not_common_denominator");
completeCurrentTask(configured, [10, 4, 1, 5]);
assert.equal(configured.getCurrentStep(), null);
assert.deepEqual(configured.getProgress(), {
  completedStepCount: 8,
  totalStepCount: 8,
  attemptCount: 9,
  completedTaskCount: 2,
  totalTaskCount: 2,
  currentTaskId: null,
  isComplete: true
});
assert.deepEqual(configured.getCompletion("addition-b"), {
  taskId: "addition-b",
  taskNumber: 2, totalTasks: 2,
  leftFraction: { numerator: 2, denominator: 5 },
  rightFraction: { numerator: 1, denominator: 10 },
  operationSymbol: "+",
  leftNumerator: 4,
  rightNumerator: 1,
  resultNumerator: 5,
  denominator: 10
});
assert.deepEqual(configured.getCompletion(), configured.getCompletion("addition-b"));
const resumed = createFractionAdditionPracticeSession({
  learnerKey: "learner-configured", storage, tasks: configuredTasks
});
assert.equal(resumed.getProgress().isComplete, true);
assert.throws(() => createFractionAdditionPracticeSession({
  learnerKey: "bad-tasks", storage, tasks: []
}), /at least one/i);
assert.throws(() => createFractionAdditionPracticeSession({
  learnerKey: "bad-tasks", storage, tasks: [configuredTasks[0], configuredTasks[0]]
}), /unique/i);
assert.throws(() => createFractionAdditionPracticeSession({
  learnerKey: "bad-tasks", storage, tasks: [{
    id: "invalid", leftFraction: { numerator: 0, denominator: 3 },
    rightFraction: { numerator: 1, denominator: 4 }
  }]
}), /positive integer fractions/i);
console.log("PacoGO fraction addition practice session tests passed.");
