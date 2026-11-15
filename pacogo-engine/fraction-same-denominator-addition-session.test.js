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
    simplifiedNumerator: "", simplifiedDenominator: "",
    ...values
  };
}

{
  it("contains 15 unique level-one tasks, including all five screenshot examples", () => {
    const exercise = FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE;
    assert.equal(exercise.questionCount, 15);
    assert.equal(exercise.tasks.length, 15);
    assert.equal(new Set(exercise.tasks.map(task => task.id)).size, 15);
    assert.equal(exercise.difficultyLevel, 1);
    assert.deepEqual(exercise.tasks.slice(0, 5).map(task => [
      task.left.numerator, task.left.denominator, task.right.numerator, task.right.denominator
    ]), [
      [3, 10, 1, 10], [5, 10, 4, 10], [9, 10, 2, 10],
      [6, 7, 5, 7], [9, 10, 9, 10]
    ]);
    assert.equal(exercise.tasks.slice(0, 5).every(task => task.source === "user-screenshot"), true);
    assert.equal(exercise.tasks.slice(5).every(task => task.source === "authored-variation"), true);
    for (const task of exercise.tasks) {
      assert.equal(task.left.denominator, task.right.denominator);
      assert.ok(task.left.numerator > 0 && task.left.numerator < task.left.denominator);
      assert.ok(task.right.numerator > 0 && task.right.numerator < task.right.denominator);
    }

}
  it("requires learner-led simplification when the result is reducible", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    assert.deepEqual(expectedFor(FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE.tasks[0]), {
      whole: 0, numerator: 4, denominator: 10, reducedNumerator: 2, reducedDenominator: 5,
      requiresSimplification: true

}
    assert.equal(session.recordAnswer({ values: answer({ numerator: "4", denominator: "10" }) }).classification, "requires_simplification");
    assert.equal(session.getProgress().completedCount, 0);
    assert.equal(session.recordAnswer({ values: answer({
      numerator: "4", denominator: "10", simplified: true,
      simplifiedNumerator: "2", simplifiedDenominator: "5"
    }) }).classification, "valid");
    expect(session.getProgress().completedCount).toBe(1);

}
  it("accepts an unsimplified sum below one when it is already in simplest form", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    assert.equal(session.recordAnswer({ values: answer({ numerator: "4", denominator: "10" }) }).classification, "requires_simplification");
    assert.equal(session.recordAnswer({ values: answer({
      numerator: "4", denominator: "10", simplified: true,
      simplifiedNumerator: "2", simplifiedDenominator: "5"
    }) }).classification, "valid");
    expect(session.recordAnswer({ values: answer({ numerator: "9", denominator: "10" }) }).classification)
      .toBe("valid");
    assert.equal(session.getProgress().completedCount, 2);
    assert.equal(session.getCurrentTask().id, "FSD1-03");

}
  it("requires a whole-number field when the sum is greater than one", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    for (let i = 0; i < 2; i++) session.recordAnswer({ values: answer({
      numerator: i === 0 ? "4" : "9", denominator: "10",
      simplified: i === 0, simplifiedNumerator: "2", simplifiedDenominator: "5"
    }) });
    assert.equal(session.recordAnswer({ values: answer({ numerator: "1", denominator: "10" }) }).classification, "requires_mixed_number");
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "10"
    }) }).classification, "valid");

}
  it("keeps the whole-number part and requires a reduced fraction for 9/10 + 9/10", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    for (let i = 0; i < 4; i++) {
      const task = session.getCurrentTask();
      const expected = expectedFor(FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE.tasks[i]);
      const values = expected.whole
        ? answer({ wholeNumberEnabled: true, wholeNumber: String(expected.whole), numerator: String(expected.numerator), denominator: String(expected.denominator) })
        : answer({ numerator: String(expected.numerator), denominator: String(expected.denominator) });
      if (expected.requiresSimplification) {
        values.simplified = true;
        values.simplifiedNumerator = String(expected.reducedNumerator);
        values.simplifiedDenominator = String(expected.reducedDenominator);
      }
      assert.equal(session.recordAnswer({ values }).classification, "valid", task.id);
      assert.ok(task);
    }
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "1", numerator: "8", denominator: "10"
    }) }).classification, "requires_simplification");
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "1", numerator: "8", denominator: "10",
      simplified: true, simplifiedNumerator: "4", simplifiedDenominator: "5"
    }) }).classification, "valid");

}
  it("rejects wrong whole-number and wrong reduced fraction values", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    for (let i = 0; i < 4; i++) {
      const expected = expectedFor(FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE.tasks[i]);
      const values = expected.whole
        ? answer({ wholeNumberEnabled: true, wholeNumber: String(expected.whole), numerator: String(expected.numerator), denominator: String(expected.denominator) })
        : answer({ numerator: String(expected.numerator), denominator: String(expected.denominator) });
      if (expected.requiresSimplification) Object.assign(values, {
        simplified: true, simplifiedNumerator: String(expected.reducedNumerator),
        simplifiedDenominator: String(expected.reducedDenominator)

}
      session.recordAnswer({ values });
    }
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "2", numerator: "8", denominator: "10"
    }) }).classification, "incorrect_answer");

}

}
console.log("PacoGO same-denominator fraction addition session tests passed.");
