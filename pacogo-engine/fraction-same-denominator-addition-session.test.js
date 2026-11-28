import assert from "node:assert/strict";
import {
  FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE,
  createFractionSameDenominatorAdditionSession,
  expectedFor
} from "./fraction-same-denominator-addition-session.js";

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
    wholeNumberEnabled: false, wholeNumber: "",
    numerator: "", denominator: "", simplified: false,
    simplifiedNumerator: "", simplifiedDenominator: "", ...values
  };
}

const exercise = FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE;
assert.equal(exercise.questionCount, 15);
assert.equal(exercise.tasks.length, 15);
assert.equal(exercise.difficultyLevel, 1);
assert.equal(exercise.maxDifficultyLevel, 5);
assert.equal(new Set(exercise.tasks.map(task => task.id)).size, 15);
assert.deepEqual(exercise.tasks.slice(0, 5).map(task => [
  task.left.numerator, task.left.denominator, task.right.numerator, task.right.denominator
]), [
  [3, 10, 1, 10], [5, 10, 4, 10], [9, 10, 2, 10],
  [6, 7, 5, 7], [9, 10, 9, 10]
]);
assert.ok(exercise.tasks.slice(0, 5).every(task => task.source === "user-screenshot"));
assert.ok(exercise.tasks.slice(5).every(task => task.source === "authored-variation"));
for (const task of exercise.tasks) {
  assert.equal(task.left.denominator, task.right.denominator);
  assert.ok(task.left.numerator > 0 && task.left.numerator < task.left.denominator);
  assert.ok(task.right.numerator > 0 && task.right.numerator < task.right.denominator);
}

const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
assert.deepEqual(expectedFor(exercise.tasks[0]), {
  whole: 0, numerator: 4, denominator: 10, reducedNumerator: 2, reducedDenominator: 5,
  requiresSimplification: true
});
assert.equal(session.recordAnswer({ values: answer({ numerator: "4", denominator: "10" }) }).classification, "requires_simplification");
assert.equal(session.getProgress().completedCount, 0);
assert.equal(session.recordAnswer({ values: answer({
  numerator: "4", denominator: "10", simplified: true,
  simplifiedNumerator: "2", simplifiedDenominator: "5"
}) }).classification, "valid");
assert.equal(session.recordAnswer({ values: answer({ numerator: "9", denominator: "10" }) }).classification, "valid");
assert.equal(session.getProgress().completedCount, 2);
assert.equal(session.getCurrentTask().id, "FSD1-03");

assert.equal(session.recordAnswer({ values: answer({ numerator: "1", denominator: "10" }) }).classification, "requires_mixed_number");
assert.equal(session.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "10"
}) }).classification, "valid");
assert.equal(session.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "4", denominator: "7"
}) }).classification, "valid");

assert.equal(session.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "8", denominator: "10"
}) }).classification, "requires_simplification");
assert.equal(session.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "8", denominator: "10",
  simplified: true, simplifiedNumerator: "4", simplifiedDenominator: "5"
}) }).classification, "valid");

assert.equal(session.getProgress().completedCount, 5);

// The learner may enter an already simplified mixed number directly in the primary fields.
const directSimplifiedSession = createFractionSameDenominatorAdditionSession({
  learnerKey: "direct-simplified", storage: memoryStorage()
});
assert.equal(directSimplifiedSession.recordAnswer({ values: answer({
  numerator: "2", denominator: "5"
}) }).classification, "valid");
assert.equal(directSimplifiedSession.recordAnswer({ values: answer({
  numerator: "9", denominator: "10"
}) }).classification, "valid");
assert.equal(directSimplifiedSession.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "10"
}) }).classification, "valid");
assert.equal(directSimplifiedSession.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "4", denominator: "7"
}) }).classification, "valid");
assert.equal(directSimplifiedSession.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "1", numerator: "4", denominator: "5"
}) }).classification, "valid");
assert.equal(directSimplifiedSession.getProgress().completedCount, 5);

const wrongWholeSession = createFractionSameDenominatorAdditionSession({ learnerKey: "other", storage: memoryStorage() });
for (const values of [
  answer({ numerator: "4", denominator: "10", simplified: true, simplifiedNumerator: "2", simplifiedDenominator: "5" }),
  answer({ numerator: "9", denominator: "10" }),
  answer({ wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "10" }),
  answer({ wholeNumberEnabled: true, wholeNumber: "1", numerator: "4", denominator: "7" })
]) wrongWholeSession.recordAnswer({ values });
assert.equal(wrongWholeSession.recordAnswer({ values: answer({
  wholeNumberEnabled: true, wholeNumber: "2", numerator: "8", denominator: "10"
}) }).classification, "incorrect_answer");

console.log("PacoGO same-denominator fraction addition session tests passed.");
