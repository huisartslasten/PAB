import assert from "node:assert/strict";
import {
  FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS,
  createFractionLikeDenominatorSubtractionSession
} from "./fraction-like-denominator-subtraction-session.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    entries: () => [...values.entries()]
  };
}

assert.equal(FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS.length, 10);
assert.deepEqual(FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS.slice(0, 4).map(task => [
  task.leftFraction.numerator, task.leftFraction.denominator,
  task.rightFraction.numerator, task.rightFraction.denominator
]), [[6,7,1,7],[7,8,1,8],[6,8,3,8],[4,10,3,10]]);
assert.equal(FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS.every(task =>
  task.leftFraction.denominator === task.rightFraction.denominator &&
  task.result.denominator === task.leftFraction.denominator &&
  task.result.numerator === task.leftFraction.numerator - task.rightFraction.numerator
), true);

const storage = memoryStorage();
const a = createFractionLikeDenominatorSubtractionSession({ learnerKey: "learner-a", storage });
const b = createFractionLikeDenominatorSubtractionSession({ learnerKey: "learner-b", storage });
assert.deepEqual(a.getCurrentTask().result, { numerator: 5, denominator: 7 });
assert.equal(a.recordAnswer({ numerator: "", denominator: "" }).classification, "invalid_input");
assert.equal(a.recordAnswer({ numerator: 4, denominator: 7 }).classification, "incorrect_answer");
assert.equal(a.getProgress().completedCount, 0);
assert.equal(a.recordAnswer({ numerator: 5, denominator: 7 }).classification, "valid");
assert.equal(a.getCurrentTask().id, "fraction-like-denominator-subtraction-02");
assert.equal(a.getProgress().completedCount, 1);
assert.equal(b.getProgress().completedCount, 0);
assert.equal(a.getProgress().attemptCount, 3);
const [key, raw] = storage.entries()[0];
assert.match(key, /learner-a/);
assert.doesNotMatch(raw, /learner-a/);
a.reset();
assert.equal(a.getProgress().completedCount, 0);
assert.throws(() => createFractionLikeDenominatorSubtractionSession({ learnerKey: " ", storage }), /learner key/);
assert.throws(() => createFractionLikeDenominatorSubtractionSession({ learnerKey: "x", storage, tasks: [] }), /at least one/i);
assert.throws(() => createFractionLikeDenominatorSubtractionSession({
  learnerKey: "x", storage,
  tasks: [{ id: "bad", leftFraction: { numerator: 1, denominator: 3 }, rightFraction: { numerator: 1, denominator: 4 } }]
}), /like-denominator/i);
console.log("PacoGO like-denominator fraction subtraction session tests passed.");
