import assert from "node:assert/strict";
import {
  FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE,
  createFractionMixedSameDenominatorAdditionSession,
  expectedFor
} from "./fraction-mixed-same-denominator-addition-session.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}
function answer(values) {
  return {
    wholeNumberEnabled: true, wholeNumber: "",
    numerator: "", denominator: "", simplified: false,
    simplifiedNumerator: "", simplifiedDenominator: "", ...values
  };
}

const exercise = FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE;
assert.equal(exercise.id, "fraction-mixed-same-denominator-addition-level-2");
assert.equal(exercise.title, "Gelijknamige breuken groter dan 1 bij elkaar optellen");
assert.equal(exercise.difficultyLevel, 2);
assert.equal(exercise.maxDifficultyLevel, 5);
assert.equal(exercise.questionCount, 15);
assert.equal(exercise.tasks.length, 15);
assert.equal(new Set(exercise.tasks.map(task => task.id)).size, 15);

for (const task of exercise.tasks) {
  assert.equal(task.left.denominator, task.right.denominator);
  assert.ok(task.left.wholeNumber > 0 && task.right.wholeNumber > 0);
  assert.ok(task.left.numerator > 0 && task.left.numerator < task.left.denominator);
  assert.ok(task.right.numerator > 0 && task.right.numerator < task.right.denominator);
  const expected = expectedFor(task);
  assert.ok(expected.whole > 0);
  assert.ok(expected.numerator > 0 && expected.numerator < expected.denominator);
}

const first = exercise.tasks[0];
assert.deepEqual(expectedFor(first), {
  whole: 4, numerator: 1, denominator: 8,
  reducedNumerator: 1, reducedDenominator: 8,
  requiresSimplification: false
});

const storage = memoryStorage();
const session = createFractionMixedSameDenominatorAdditionSession({ learnerKey: "Zyon", storage });
assert.equal(session.getCurrentTask().id, "FMSD2-01");
assert.equal(session.getProgress().totalCount, 15);

// Correct but reducible: keep the task open and let the learner simplify.
assert.equal(session.recordAnswer({ values: answer({
  wholeNumber: "4", numerator: "2", denominator: "16"
}) }).classification, "requires_simplification");
assert.equal(session.getProgress().completedCount, 0);
assert.equal(session.recordAnswer({ values: answer({
  wholeNumber: "4", numerator: "2", denominator: "16",
  simplified: true, simplifiedNumerator: "1", simplifiedDenominator: "8"
}) }).classification, "valid");
assert.equal(session.getProgress().completedCount, 1);

// The final simplified answer may also be entered directly in the primary fields.
const direct = createFractionMixedSameDenominatorAdditionSession({
  learnerKey: "direct", storage: memoryStorage()
});
for (const task of exercise.tasks) {
  const expected = expectedFor(task);
  const result = direct.recordAnswer({ values: answer({
    wholeNumber: String(expected.whole),
    numerator: String(expected.reducedNumerator),
    denominator: String(expected.reducedDenominator)
  }) });
  assert.equal(result.classification, "valid", task.id);
}
assert.equal(direct.getProgress().completedCount, 15);
assert.equal(direct.getProgress().isComplete, true);
assert.equal(direct.getCurrentTask(), null);

// Wrong answers and missing required whole-number fields remain incomplete.
const invalid = createFractionMixedSameDenominatorAdditionSession({
  learnerKey: "invalid", storage: memoryStorage()
});
assert.equal(invalid.recordAnswer({ values: answer({
  wholeNumberEnabled: false, wholeNumber: "",
  numerator: "1", denominator: "8"
}) }).classification, "invalid_input");
assert.equal(invalid.recordAnswer({ values: answer({
  wholeNumber: "3", numerator: "1", denominator: "8"
}) }).classification, "incorrect_answer");
assert.equal(invalid.getProgress().completedCount, 0);

console.log("PacoGO mixed same-denominator fraction addition session tests passed.");
