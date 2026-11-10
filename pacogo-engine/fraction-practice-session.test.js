import assert from "node:assert/strict";
import { FRACTION_PRACTICE_TASKS, createFractionPracticeSession } from "./fraction-practice-session.js";

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
const learnerA = createFractionPracticeSession({ learnerKey: "learner-a", storage });
const learnerB = createFractionPracticeSession({ learnerKey: "learner-b", storage });

assert.equal(FRACTION_PRACTICE_TASKS.length, 3);
assert.equal(learnerA.getProgress().completedCount, 0);
assert.equal(learnerA.getNextTaskId(), "FR2-PRACTICE-01");
assert.equal(learnerA.recordAnswer({ taskId: "FR2-PRACTICE-01", correct: false }).completedCount, 0);
assert.equal(learnerA.getProgress().attemptsByTask["FR2-PRACTICE-01"], 1);
assert.equal(learnerA.getNextTaskId(), "FR2-PRACTICE-01");
assert.equal(learnerA.recordAnswer({ taskId: "FR2-PRACTICE-01", correct: true }).completedCount, 1);
assert.equal(learnerA.getNextTaskId(), "FR2-PRACTICE-02");
assert.equal(learnerB.getProgress().completedCount, 0);
assert.equal(learnerB.getProgress().correctAnswers, 0);

learnerA.recordAnswer({ taskId: "FR2-PRACTICE-02", correct: true });
learnerA.recordAnswer({ taskId: "FR2-PRACTICE-03", correct: true });
assert.equal(learnerA.getProgress().isComplete, true);
assert.equal(learnerA.getProgress().correctAnswers, 3);
assert.equal(learnerA.getNextTaskId(), null);

const persistedEntries = storage.entries();
assert.equal(persistedEntries.length, 1);
assert.match(persistedEntries[0][0], /learner-a/);
assert.doesNotMatch(persistedEntries[0][0], /learner-b/);
const persistedValues = persistedEntries.map(([, value]) => value);
assert.equal(persistedValues.some(value => value.includes("explanation") || value.includes("response")), false);
assert.equal(persistedValues.some(value => value.includes("learner-a")), false);
assert.equal(learnerB.getProgress().isComplete, false);

learnerA.reset();
assert.equal(learnerA.getProgress().completedCount, 0);
assert.equal(learnerB.getProgress().completedCount, 0);
assert.throws(() => createFractionPracticeSession({ learnerKey: " " , storage }), /learner key/);
assert.throws(() => createFractionPracticeSession({ learnerKey: "learner-a" }), /local storage/);
assert.throws(() => learnerB.recordAnswer({ taskId: "unknown", correct: true }), /Unknown/);
assert.throws(() => learnerB.recordAnswer({ taskId: "FR2-PRACTICE-01", correct: "yes" }), /boolean/);

console.log("PacoGO Fraction practice-only session tests passed.");
