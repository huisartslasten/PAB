import assert from "node:assert/strict";
import {
  FRACTION_SUBTRACTION_EXERCISE,
  createFractionSubtractionPracticeSession
} from "./fraction-whole-minus-mixed-subtraction-session.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    entries: () => [...values.entries()]
  };
}

const exercise = FRACTION_SUBTRACTION_EXERCISE;
assert.equal(exercise.questionCount, 4);
assert.equal(exercise.tasks.length, 4);
assert.equal(exercise.difficultyLevel, 1);
assert.equal(exercise.maxDifficultyLevel, 5);
assert.deepEqual(exercise.tasks.map(task => [task.whole, task.mixed.whole, task.mixed.numerator, task.mixed.denominator]), [
  [8, 2, 5, 7],
  [6, 5, 4, 9],
  [6, 3, 3, 7],
  [9, 8, 6, 7]
]);
assert.deepEqual(exercise.tasks.map(task => task.answer), [
  { whole: 5, numerator: 2, denominator: 7 },
  { whole: 0, numerator: 5, denominator: 9 },
  { whole: 2, numerator: 4, denominator: 7 },
  { whole: 0, numerator: 1, denominator: 7 }
]);
assert.equal(new Set(exercise.tasks.map(task => task.id)).size, 4);

const storage = createMemoryStorage();
const learnerA = createFractionSubtractionPracticeSession({ learnerKey: "learner-a", storage });
const learnerB = createFractionSubtractionPracticeSession({ learnerKey: "learner-b", storage });
assert.deepEqual(
  Object.fromEntries(["id", "index", "total", "difficultyLevel", "maxDifficultyLevel"].map(key =>
    [key, learnerA.getCurrentTask()[key]]
  )),
  { id: "FWS1-01", index: 1, total: 4, difficultyLevel: 1, maxDifficultyLevel: 5 }
);
assert.equal(learnerA.getProgress().completedCount, 0);

// The first result is a mixed number: 5 2/7.
const firstCorrect = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: "5", numerator: "2", denominator: "7" }
});
assert.equal(firstCorrect.classification, "valid");
assert.equal(firstCorrect.progress.completedCount, 1);
assert.equal(firstCorrect.currentTask.id, "FWS1-02");

// The second result is a proper fraction: the whole-number field must stay disabled.
const unnecessaryWhole = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: "0", numerator: "5", denominator: "9" }
});
assert.equal(unnecessaryWhole.classification, "invalid_input");
assert.equal(unnecessaryWhole.progress.completedCount, 1);

const secondCorrect = learnerA.recordAnswer({
  values: { wholeNumberEnabled: false, numerator: "5", denominator: "9" }
});
assert.equal(secondCorrect.classification, "valid");
assert.equal(secondCorrect.currentTask.id, "FWS1-03");

// Wrong answers are recorded but do not advance the learner.
const wrongThird = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: "2", numerator: "3", denominator: "7" }
});
assert.equal(wrongThird.classification, "incorrect_answer");
assert.equal(wrongThird.progress.completedCount, 2);
assert.equal(wrongThird.currentTask.id, "FWS1-03");

const thirdCorrect = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: "2", numerator: "4", denominator: "7" }
});
assert.equal(thirdCorrect.classification, "valid");
assert.equal(thirdCorrect.currentTask.id, "FWS1-04");

const fourthCorrect = learnerA.recordAnswer({
  values: { wholeNumberEnabled: false, numerator: "1", denominator: "7" }
});
assert.equal(fourthCorrect.classification, "valid");
assert.equal(fourthCorrect.currentTask, null);
assert.deepEqual(learnerA.getProgress(), {
  completedCount: 4,
  totalCount: 4,
  attemptCount: 6,
  isComplete: true
});
assert.equal(learnerB.getProgress().completedCount, 0);
assert.throws(() => learnerA.recordAnswer({ values: {} }), /already complete/);

const [storageKey, saved] = storage.entries().find(([key]) => key.includes("learner-a"));
assert.match(storageKey, /pacogo:fraction-subtraction-practice:v2:learner-a/);
assert.equal(saved.includes("learner-a"), false);

learnerA.reset();
assert.equal(learnerA.getProgress().completedCount, 0);
assert.equal(learnerB.getProgress().completedCount, 0);
assert.throws(
  () => createFractionSubtractionPracticeSession({ learnerKey: " ", storage }),
  /learner key/
);
assert.throws(
  () => createFractionSubtractionPracticeSession({ learnerKey: "learner-a" }),
  /local storage/
);
console.log("PacoGO whole-minus-mixed subtraction session tests passed.");
