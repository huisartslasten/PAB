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

const storage = createMemoryStorage();
const learnerA = createFractionAdditionPracticeSession({ learnerKey: "learner-a", storage });
const learnerB = createFractionAdditionPracticeSession({ learnerKey: "learner-b", storage });
assert.equal(learnerA.getCurrentStep().stepId, "common_denominator");
assert.equal(learnerA.getCurrentStep().stepNumber, 1);
assert.equal(learnerA.getCurrentStep().expression, "1/3 + 1/4 → noemer ?");
assert.equal(learnerA.recordResponse({ rawValue: "6" }).classification, "not_common_denominator");
assert.equal(learnerA.getCurrentStep().stepId, "common_denominator");
assert.equal(learnerA.recordResponse({ rawValue: "12" }).classification, "valid");
assert.equal(learnerA.getCurrentStep().expression, "1/3 = ?/12");
assert.equal(learnerA.recordResponse({ rawValue: "3" }).classification, "not_equivalent");
assert.equal(learnerA.getCurrentStep().stepId, "left_equivalent_numerator");
assert.equal(learnerA.recordResponse({ rawValue: "4" }).classification, "valid");
assert.equal(learnerA.getCurrentStep().expression, "1/4 = ?/12");
assert.equal(learnerA.recordResponse({ rawValue: "3" }).classification, "valid");
assert.equal(learnerA.getCurrentStep().expression, "4 + 3 = ?");
assert.equal(learnerA.recordResponse({ rawValue: "8" }).classification, "arithmetic_error");
assert.equal(learnerA.getCurrentStep().stepId, "addition_result");
const done = learnerA.recordResponse({ rawValue: "7" });
assert.equal(done.classification, "valid");
assert.equal(done.progress.isComplete, true);
assert.deepEqual(done.completion, { leftNumerator: 4, rightNumerator: 3, resultNumerator: 7, denominator: 12 });
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
console.log("PacoGO fraction addition practice session tests passed.");
