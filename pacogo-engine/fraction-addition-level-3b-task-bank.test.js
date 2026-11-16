import assert from "node:assert/strict";
import { FRACTION_ADDITION_LEVEL_3B_TASKS } from "./fraction-addition-level-3b-task-bank.js";
import { createFractionAdditionPracticeSession } from "./fraction-addition-practice-session.js";

assert.equal(FRACTION_ADDITION_LEVEL_3B_TASKS.length, 10);
assert.equal(new Set(FRACTION_ADDITION_LEVEL_3B_TASKS.map(task => task.id)).size, 10);
for (const task of FRACTION_ADDITION_LEVEL_3B_TASKS) {
  assert.ok(task.leftFraction.numerator < task.leftFraction.denominator, task.id);
  assert.ok(task.rightFraction.numerator < task.rightFraction.denominator, task.id);
  const sum = task.leftFraction.numerator / task.leftFraction.denominator +
    task.rightFraction.numerator / task.rightFraction.denominator;
  assert.ok(sum > 1, task.id);
  assert.equal(task.requiresMixedNumber, true);
}
assert.throws(() => { FRACTION_ADDITION_LEVEL_3B_TASKS[0].leftFraction.numerator = 1; }, TypeError);

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    entries: () => [...values.entries()]
  };
}
const storage = memoryStorage();
const session = createFractionAdditionPracticeSession({
  learnerKey: "level-3b",
  sessionId: "level-3b",
  storage,
  tasks: [FRACTION_ADDITION_LEVEL_3B_TASKS[0]]
});
assert.equal(session.getCurrentStep().stepId, "common_denominator");
assert.equal(session.getCurrentStep().totalSteps, 5);
for (const value of ["12", "10", "9", "19"]) {
  assert.equal(session.recordResponse({ rawValue: value }).classification, "valid");
}
const mixedStep = session.getCurrentStep();
assert.equal(mixedStep.stepId, "mixed_number_conversion");
assert.equal(mixedStep.stepNumber, 5);
assert.equal(mixedStep.resultNumerator, 19);
assert.equal(mixedStep.commonDenominator, 12);
assert.equal(session.recordResponse({ values: {
  wholeNumberEnabled: false, wholeNumber: "", numerator: "19", denominator: "12",
  simplified: false, simplifiedNumerator: "", simplifiedDenominator: ""
} }).classification, "requires_mixed_number");
assert.equal(session.getCurrentStep().stepId, "mixed_number_conversion");
assert.equal(session.recordResponse({ values: {
  wholeNumberEnabled: true, wholeNumber: "2", numerator: "7", denominator: "12",
  simplified: false, simplifiedNumerator: "", simplifiedDenominator: ""
} }).classification, "incorrect_mixed_number");
assert.equal(session.recordResponse({ values: {
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "7", denominator: "12",
  simplified: false, simplifiedNumerator: "", simplifiedDenominator: ""
} }).classification, "valid");
assert.equal(session.getProgress().completedTaskCount, 1);
assert.equal(session.getProgress().isComplete, true);
assert.equal(session.getCompletion().resultWholeNumber, 1);
assert.equal(session.getCompletion().resultRemainderNumerator, 7);

// A correct but reducible mixed fraction remains open until the learner simplifies it.
const reducibleTask = {
  id: "reducible",
  leftFraction: { numerator: 5, denominator: 6 },
  rightFraction: { numerator: 1, denominator: 2 },
  requiresMixedNumber: true
};
const reducible = createFractionAdditionPracticeSession({
  learnerKey: "level-3b-reducible", sessionId: "level-3b", storage: memoryStorage(), tasks: [reducibleTask]
});
for (const value of ["6", "5", "3", "8"]) reducible.recordResponse({ rawValue: value });
assert.equal(reducible.getCurrentStep().resultNumerator, 8);
assert.equal(reducible.recordResponse({ values: {
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "2", denominator: "6",
  simplified: false, simplifiedNumerator: "", simplifiedDenominator: ""
} }).classification, "requires_simplification");
assert.equal(reducible.getProgress().completedTaskCount, 0);
assert.equal(reducible.recordResponse({ values: {
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "2", denominator: "6",
  simplified: true, simplifiedNumerator: "1", simplifiedDenominator: "3"
} }).classification, "valid");
assert.equal(reducible.getProgress().isComplete, true);

console.log("PacoGO guided mixed-number addition tests passed.");
