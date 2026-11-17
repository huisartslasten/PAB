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
assert.equal(exercise.questionCount, 15);
assert.equal(exercise.tasks.length, 15);
assert.equal(exercise.difficultyLevel, 1);
assert.equal(exercise.maxDifficultyLevel, 5);
assert.equal(new Set(exercise.tasks.map(task => task.id)).size, 15);
assert.ok(exercise.tasks.every(task =>
  task.whole > task.mixed.whole &&
  task.mixed.numerator > 0 &&
  task.mixed.numerator < task.mixed.denominator &&
  task.answer.whole === task.whole - task.mixed.whole - 1 &&
  task.answer.numerator === task.mixed.denominator - task.mixed.numerator &&
  task.answer.denominator === task.mixed.denominator
));
assert.equal(new Set(exercise.tasks.map(task =>
  [task.whole, task.mixed.whole, task.mixed.numerator, task.mixed.denominator].join("|")
)).size, 15);

const storage = createMemoryStorage();
const learnerA = createFractionSubtractionPracticeSession({ learnerKey: "learner-a", storage });
const learnerB = createFractionSubtractionPracticeSession({ learnerKey: "learner-b", storage });
assert.deepEqual(
  Object.fromEntries(["id", "index", "total", "difficultyLevel", "maxDifficultyLevel"].map(key =>
    [key, learnerA.getCurrentTask()[key]]
  )),
  { id: "FWS1-01", index: 1, total: 15, difficultyLevel: 1, maxDifficultyLevel: 5 }
);
assert.equal(learnerA.getProgress().completedCount, 0);

// First task: verify mixed-number input and progress.
const first = exercise.tasks[0];
const firstCorrect = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: String(first.answer.whole),
    numerator: String(first.answer.numerator), denominator: String(first.answer.denominator) }
});
assert.equal(firstCorrect.classification, "valid");
assert.equal(firstCorrect.progress.completedCount, 1);
assert.equal(firstCorrect.currentTask.id, "FWS1-02");

// Wrong answers are retained without advancing; then all remaining authored tasks are completed.
const wrongSecond = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: "99", numerator: "1", denominator: "2" }
});
assert.equal(wrongSecond.classification, "incorrect_answer");
assert.equal(wrongSecond.progress.completedCount, 1);
assert.equal(wrongSecond.currentTask.id, "FWS1-02");

for (const task of exercise.tasks.slice(1)) {
  const answer = learnerA.recordAnswer({
    values: {
      wholeNumberEnabled: task.answer.whole > 0,
      wholeNumber: task.answer.whole > 0 ? String(task.answer.whole) : "",
      numerator: String(task.answer.numerator),
      denominator: String(task.answer.denominator)
    }
  });
  assert.equal(answer.classification, "valid", task.id);
}
assert.equal(learnerA.getCurrentTask(), null);
assert.deepEqual(learnerA.getProgress(), {
  completedCount: 15,
  totalCount: 15,
  attemptCount: 16,
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
