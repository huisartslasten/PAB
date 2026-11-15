import assert from "node:assert/strict";
import {
  FRACTION_WHOLE_MIXED_ADDITION_EXERCISE,
  createFractionWholeMixedAdditionSession
} from "./fraction-whole-mixed-addition-session.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    entries: () => [...values.entries()]
  };
}

const exercise = FRACTION_WHOLE_MIXED_ADDITION_EXERCISE;
assert.equal(exercise.questionCount, 15);
assert.equal(exercise.tasks.length, 15);
assert.equal(exercise.difficultyLevel, 1);
assert.equal(exercise.maxDifficultyLevel, 5);
assert.ok(exercise.tasks.every(task => task.mixed.whole >= 1));
assert.ok(exercise.tasks.every(task =>
  task.answer.whole === task.whole + task.mixed.whole &&
  task.answer.numerator === task.mixed.numerator &&
  task.answer.denominator === task.mixed.denominator
));
assert.equal(new Set(exercise.tasks.map(task => task.id)).size, 15);

const storage = createMemoryStorage();
const learnerA = createFractionWholeMixedAdditionSession({ learnerKey: "learner-a", storage });
const learnerB = createFractionWholeMixedAdditionSession({ learnerKey: "learner-b", storage });

assert.deepEqual(
  Object.fromEntries(["index", "total", "difficultyLevel", "maxDifficultyLevel"].map(key =>
    [key, learnerA.getCurrentTask()[key]]
  )),
  { index: 1, total: 15, difficultyLevel: 1, maxDifficultyLevel: 5 }
);
assert.equal(learnerA.getProgress().completedCount, 0);

const firstTask = exercise.tasks[0];
const noMixedNumber = learnerA.recordAnswer({
  values: { wholeNumberEnabled: false, numerator: "1", denominator: "2" }
});
assert.equal(noMixedNumber.classification, "requires_mixed_number");
assert.equal(noMixedNumber.progress.completedCount, 0);

const wrong = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: "4", numerator: "1", denominator: "2" }
});
assert.equal(wrong.classification, "incorrect_answer");
assert.equal(wrong.progress.completedCount, 0);

const needsSimplification = learnerA.recordAnswer({
  values: { wholeNumberEnabled: true, wholeNumber: "3", numerator: "2", denominator: "4" }
});
assert.equal(needsSimplification.classification, "requires_simplification");
assert.equal(needsSimplification.progress.completedCount, 0);

const simplified = learnerA.recordAnswer({
  values: {
    wholeNumberEnabled: true, wholeNumber: "3", numerator: "2", denominator: "4",
    simplified: true, simplifiedNumerator: "1", simplifiedDenominator: "2"
  }
});
assert.equal(simplified.classification, "valid");
assert.equal(simplified.progress.completedCount, 1);
assert.equal(simplified.currentTask.id, exercise.tasks[1].id);
assert.equal(learnerB.getProgress().completedCount, 0);

// Complete the remaining fixed questions using their authored mixed-number answers.
for (const task of exercise.tasks.slice(1)) {
  const current = learnerA.getCurrentTask();
  assert.equal(current.id, task.id);
  const result = learnerA.recordAnswer({
    values: {
      wholeNumberEnabled: true,
      wholeNumber: String(task.answer.whole),
      numerator: String(task.answer.numerator),
      denominator: String(task.answer.denominator)
    }
  });
  assert.equal(result.classification, "valid", task.id);
}

assert.equal(learnerA.getCurrentTask(), null);
assert.deepEqual(learnerA.getProgress(), {
  completedCount: 15,
  totalCount: 15,
  attemptCount: 18,
  isComplete: true
});
assert.throws(() => learnerA.recordAnswer({ values: {} }), /already complete/);

const [storageKey, saved] = storage.entries().find(([key]) => key.includes("learner-a"));
assert.match(storageKey, /pacogo:fraction-whole-mixed-addition:v1:learner-a/);
assert.equal(saved.includes('"requires_simplification"'), true);
assert.equal(saved.includes("learner-a"), false);
assert.throws(
  () => createFractionWholeMixedAdditionSession({ learnerKey: " " , storage }),
  /learner key/
);
assert.throws(
  () => createFractionWholeMixedAdditionSession({ learnerKey: "learner-a" }),
  /local storage/
);

learnerA.reset();
assert.equal(learnerA.getProgress().completedCount, 0);
assert.equal(learnerB.getProgress().completedCount, 0);
console.log("PacoGO whole-number and mixed-fraction addition session tests passed.");
