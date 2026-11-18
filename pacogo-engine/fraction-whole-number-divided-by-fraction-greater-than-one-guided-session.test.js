import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_WHOLE_NUMBER_DIVIDED_BY_FRACTION_GREATER_THAN_ONE_GUIDED_TASKS as tasks } from "./fraction-whole-number-divided-by-fraction-greater-than-one-guided-task-bank.js";
import { FRACTION_WHOLE_NUMBER_DIVIDED_BY_FRACTION_GREATER_THAN_ONE_TASKS as independentTasks } from "./fraction-whole-number-divided-by-fraction-greater-than-one-task-bank.js";
import { createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession } from "./fraction-whole-number-divided-by-fraction-greater-than-one-guided-session.js";

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}
function answerValues(task) {
  return { wholeNumberEnabled: true, wholeNumber: String(task.answer.whole), numerator: String(task.answer.numerator), denominator: String(task.answer.denominator) };
}

test("guided division exposes four ordered steps and validates each conversion separately", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "Zyon", storage, tasks });
  const first = session.getCurrentStep();
  assert.equal(first.stepId, "convert_mixed_number");
  assert.equal(first.stepNumber, 1);
  assert.equal(first.totalSteps, 4);
  assert.equal(first.divisorNumerator, 5);
  assert.equal(session.recordResponse({ rawValue: "4" }).classification, "incorrect_answer");
  assert.equal(session.recordResponse({ rawValue: "5" }).classification, "valid");
  assert.equal(session.getCurrentStep().stepId, "make_divisor_whole");
  assert.equal(session.getCurrentStep().expression, "5/2 × 2 = ?");
  assert.equal(session.recordResponse({ rawValue: "4" }).classification, "incorrect_answer");
  assert.equal(session.recordResponse({ rawValue: "5" }).classification, "valid");
  assert.equal(session.getCurrentStep().stepId, "scale_dividend");
  assert.equal(session.getCurrentStep().scaledDividend, 16);
  assert.equal(session.recordResponse({ rawValue: "15" }).classification, "incorrect_answer");
  assert.equal(session.recordResponse({ rawValue: "16" }).classification, "valid");
  assert.equal(session.getCurrentStep().stepId, "calculate_quotient");
  assert.equal(session.getCurrentStep().expression, "16 : 5");
  assert.equal(session.recordResponse({ values: answerValues(tasks[0]) }).classification, "valid");
  assert.equal(session.getCurrentStep().taskNumber, 2);
  assert.equal(session.getCurrentStep().stepNumber, 1);
  assert.deepEqual(session.getProgress(), { completedCount: 1, totalCount: 15, completedStepCount: 4, totalStepCount: 60, attemptCount: 7, isComplete: false });
});

test("guided division requires simplified mixed-number answers and resumes per learner", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "learner-a", storage, tasks });
  session.recordResponse({ rawValue: String(tasks[0].divisor.whole * tasks[0].divisor.denominator + tasks[0].divisor.numerator) });
  session.recordResponse({ rawValue: String(tasks[0].divisor.whole * tasks[0].divisor.denominator + tasks[0].divisor.numerator) });
  session.recordResponse({ rawValue: String(tasks[0].wholeNumber * tasks[0].divisor.denominator) });
  assert.equal(session.recordResponse({ values: { ...answerValues(tasks[0]), numerator: "2", denominator: "10" } }).classification, "requires_simplification");
  assert.equal(session.recordResponse({ values: { ...answerValues(tasks[0]), numerator: "2", denominator: "10", simplified: true, simplifiedNumerator: "1", simplifiedDenominator: "5" } }).classification, "valid");
  const resumed = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "learner-a", storage, tasks });
  assert.equal(resumed.getCurrentStep().taskNumber, 2);
  const other = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "learner-b", storage, tasks });
  assert.equal(other.getCurrentStep().taskNumber, 1);
});

test("guided division completes exactly fifteen tasks and resets", () => {
  const storage = memoryStorage();
  const session = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "complete", storage, tasks });
  for (const task of tasks) {
    const divisorNumerator = task.divisor.whole * task.divisor.denominator + task.divisor.numerator;
    assert.equal(session.recordResponse({ rawValue: String(divisorNumerator) }).classification, "valid");
    assert.equal(session.recordResponse({ rawValue: String(divisorNumerator) }).classification, "valid");
    assert.equal(session.recordResponse({ rawValue: String(task.wholeNumber * task.divisor.denominator) }).classification, "valid");
    assert.equal(session.recordResponse({ values: answerValues(task) }).classification, "valid");
  }
  assert.equal(session.getCurrentStep(), null);
  assert.equal(session.getProgress().isComplete, true);
  assert.equal(session.getProgress().completedStepCount, 60);
  session.reset();
  assert.equal(session.getCurrentStep().taskNumber, 1);
});

test("guided division rejects invalid task banks and corrupt saved step sequences", () => {
  const storage = memoryStorage();
  assert.throws(() => createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "x", storage, tasks: tasks.slice(0, 14) }), /Exactly 15/);
  const invalid = tasks.map((task, i) => i ? task : { ...task, answer: { whole: 1, numerator: 1, denominator: 2 } });
  assert.throws(() => createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "x", storage, tasks: invalid }), /incorrect answer/);
  storage.setItem("pacogo:fraction-whole-number-divided-by-fraction-greater-than-one-guided:v1:bad", JSON.stringify({
    schemaVersion: 2, completedTaskIds: [], completedStepIdsByTask: { [tasks[0].id]: ["make_divisor_whole"] }, responsesByTask: {}
  }));
  const corrupted = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "bad", storage, tasks });
  assert.throws(() => corrupted.getCurrentStep(), /invalid step sequence/);
});

test("guided division uses a separate set of fifteen tasks from the independent exercise", () => {
  const independent = new Set(independentTasks.map(task => [task.wholeNumber, task.divisor.whole, task.divisor.numerator, task.divisor.denominator].join("|")));
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map(task => [task.wholeNumber, task.divisor.whole, task.divisor.numerator, task.divisor.denominator].join("|"))).size, 15);
  assert.equal(tasks.every(task => !independent.has([task.wholeNumber, task.divisor.whole, task.divisor.numerator, task.divisor.denominator].join("|"))), true);
});

test("guided division keeps legacy three-step progress untouched when the four-step session starts", () => {
  const storage = memoryStorage();
  const legacyKey = "pacogo:fraction-whole-number-divided-by-fraction-greater-than-one-guided:v1:Zyon";
  const legacyValue = JSON.stringify({ schemaVersion: 1, completedTaskIds: ["legacy-task"], completedStepIdsByTask: {}, responsesByTask: {} });
  storage.setItem(legacyKey, legacyValue);
  const session = createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey: "Zyon", storage, tasks });
  assert.equal(session.getCurrentStep().stepId, "convert_mixed_number");
  assert.equal(storage.getItem(legacyKey), legacyValue);
});
