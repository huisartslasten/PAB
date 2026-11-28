import assert from "node:assert/strict";
import { createWholeNumberMixedFractionAdditionSession } from "./fraction-whole-number-mixed-addition-session.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

const storage = memoryStorage();
const session = createWholeNumberMixedFractionAdditionSession({
  learnerKey: "learner-a",
  task: { id: "example-10-plus-4-and-7-tenths", addend: 10, wholeNumber: 4, numerator: 7, denominator: 10 },
  storage
});
assert.deepEqual(session.getCurrentTask(), {
  id: "example-10-plus-4-and-7-tenths",
  addend: 10,
  wholeNumber: 4,
  numerator: 7,
  denominator: 10,
  resultWholeNumber: 14
});
assert.equal(session.recordResponse({ values: { wholeNumberEnabled: true, wholeNumber: "14", numerator: "7", denominator: "10" } }).classification, "valid");
assert.equal(session.getProgress().isComplete, true);
assert.equal(session.getCompletion().wholeNumber, "14");
assert.throws(() => session.recordResponse({ values: {} }), /already complete/);

session.reset();
const reducible = createWholeNumberMixedFractionAdditionSession({
  learnerKey: "learner-a",
  task: { id: "reducible", addend: 2, wholeNumber: 1, numerator: 4, denominator: 8 },
  storage
});
const first = reducible.recordResponse({ values: { wholeNumberEnabled: true, wholeNumber: "3", numerator: "4", denominator: "8" } });
assert.equal(first.classification, "requires_simplification");
assert.equal(first.progress.isComplete, false);
assert.equal(first.progress.attemptCount, 1);
const second = reducible.recordResponse({ values: {
  wholeNumberEnabled: true, wholeNumber: "3", numerator: "4", denominator: "8",
  simplified: true, simplifiedNumerator: "1", simplifiedDenominator: "2"
} });
assert.equal(second.classification, "valid");
assert.equal(second.progress.isComplete, true);

reducible.reset();
assert.equal(reducible.recordResponse({ values: {
  wholeNumberEnabled: true, wholeNumber: "3", numerator: "4", denominator: "8",
  simplified: true, simplifiedNumerator: "2", simplifiedDenominator: "4"
} }).classification, "not_simplified");

reducible.reset();
assert.equal(reducible.recordResponse({ values: { wholeNumberEnabled: true, wholeNumber: "4", numerator: "4", denominator: "8" } }).classification, "incorrect_answer");
assert.equal(reducible.recordResponse({ values: { wholeNumberEnabled: true, wholeNumber: "3", numerator: "4", denominator: "0" } }).classification, "invalid_input");

assert.throws(() => createWholeNumberMixedFractionAdditionSession({
  learnerKey: "learner-a", task: { addend: 1, wholeNumber: 2, numerator: 5, denominator: 4 }, storage
}), /proper fraction/);
assert.throws(() => createWholeNumberMixedFractionAdditionSession({
  learnerKey: " ", task: { addend: 1, wholeNumber: 2, numerator: 1, denominator: 4 }, storage
}), /learner key/);

console.log("PacoGO whole-number plus mixed-fraction addition session tests passed.");
