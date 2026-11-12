import assert from "node:assert/strict";
import {
  FRACTION_CONSTRUCTION_PRACTICE_TASKS,
  createFractionConstructionPracticeSession,
  evaluateEquivalentNumerator
} from "./fraction-construction-practice-session.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    entries: () => [...values.entries()]
  };
}

assert.equal(FRACTION_CONSTRUCTION_PRACTICE_TASKS.length, 3);
assert.equal(evaluateEquivalentNumerator({ targetFraction: { numerator: 1, denominator: 2 }, numerator: 2, denominator: 4 }), "correct");
assert.equal(evaluateEquivalentNumerator({ targetFraction: { numerator: 1, denominator: 2 }, numerator: 3, denominator: 4 }), "not_equivalent");
assert.equal(evaluateEquivalentNumerator({ targetFraction: { numerator: 1, denominator: 2 }, numerator: NaN, denominator: 4 }), "invalid_input");

const storage = createMemoryStorage();
const learnerA = createFractionConstructionPracticeSession({ learnerKey: "learner-a", storage });
const learnerB = createFractionConstructionPracticeSession({ learnerKey: "learner-b", storage });
assert.equal(learnerA.getProgress().completedCount, 0);
assert.equal(learnerA.getNextTaskId(), "fraction-construction-practice-01");
const wrong = learnerA.recordResponse({ taskId: "fraction-construction-practice-01", rawNumerator: "1" });
assert.equal(wrong.classification, "not_equivalent");
assert.equal(wrong.progress.completedCount, 0);
assert.equal(wrong.progress.attemptsByTask["fraction-construction-practice-01"], 1);
assert.equal(learnerA.getNextTaskId(), "fraction-construction-practice-01");
const correct = learnerA.recordResponse({ taskId: "fraction-construction-practice-01", rawNumerator: "2" });
assert.equal(correct.classification, "correct");
assert.equal(correct.progress.completedCount, 1);
assert.equal(learnerA.getNextTaskId(), "fraction-construction-practice-02");
assert.equal(learnerB.getProgress().completedCount, 0);
learnerA.recordResponse({ taskId: "fraction-construction-practice-02", rawNumerator: "2" });
learnerA.recordResponse({ taskId: "fraction-construction-practice-03", rawNumerator: "4" });
assert.equal(learnerA.getProgress().isComplete, true);
assert.equal(learnerA.getNextTaskId(), null);
const entries = storage.entries();
assert.equal(entries.length, 1);
assert.match(entries[0][0], /pacogo:fraction-construction-practice:v1:learner-a/);
assert.equal(entries[0][1].includes('"rawNumerator":"1"'), true);
assert.equal(entries[0][1].includes('"rawNumerator":"2"'), true);
assert.equal(entries[0][1].includes("learner-a"), false);
assert.equal(learnerB.getProgress().isComplete, false);
assert.equal(learnerA.recordResponse({ taskId: "fraction-construction-practice-01", rawNumerator: "not-a-number" }).classification, "invalid_input");
assert.throws(() => learnerA.recordResponse({ taskId: "unknown", rawNumerator: "2" }), /Unknown/);
assert.throws(() => createFractionConstructionPracticeSession({ learnerKey: " ", storage }), /learner key/);
assert.throws(() => createFractionConstructionPracticeSession({ learnerKey: "learner-a" }), /local storage/);
learnerA.reset();
assert.equal(learnerA.getProgress().completedCount, 0);
assert.equal(learnerB.getProgress().completedCount, 0);
console.log("PacoGO fraction construction practice session tests passed.");
