import { describe, expect, it } from "vitest";
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

describe("same-denominator fraction addition exercise", () => {
  it("contains 15 unique level-one tasks, including all five screenshot examples", () => {
    const exercise = FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE;
    expect(exercise.questionCount).toBe(15);
    expect(exercise.tasks).toHaveLength(15);
    expect(new Set(exercise.tasks.map(task => task.id)).size).toBe(15);
    expect(exercise.difficultyLevel).toBe(1);
    expect(exercise.tasks.slice(0, 5).map(task => [
      task.left.numerator, task.left.denominator, task.right.numerator, task.right.denominator
    ])).toEqual([
      [3, 10, 1, 10], [5, 10, 4, 10], [9, 10, 2, 10],
      [6, 7, 5, 7], [9, 10, 9, 10]
    ]);
    expect(exercise.tasks.slice(0, 5).every(task => task.source === "user-screenshot")).toBe(true);
    expect(exercise.tasks.slice(5).every(task => task.source === "authored-variation")).toBe(true);
    for (const task of exercise.tasks) {
      expect(task.left.denominator).toBe(task.right.denominator);
      expect(task.left.numerator).toBeGreaterThan(0);
      expect(task.left.numerator).toBeLessThan(task.left.denominator);
      expect(task.right.numerator).toBeGreaterThan(0);
      expect(task.right.numerator).toBeLessThan(task.right.denominator);
    }
  });

  it("requires learner-led simplification when the result is reducible", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    expect(expectedFor(FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE.tasks[0])).toMatchObject({
      whole: 0, numerator: 4, denominator: 10, reducedNumerator: 2, reducedDenominator: 5,
      requiresSimplification: true
    });
    expect(session.recordAnswer({ values: answer({ numerator: "4", denominator: "10" }) }).classification)
      .toBe("requires_simplification");
    expect(session.getProgress().completedCount).toBe(0);
    expect(session.recordAnswer({ values: answer({
      numerator: "4", denominator: "10", simplified: true,
      simplifiedNumerator: "2", simplifiedDenominator: "5"
    }) }).classification).toBe("valid");
    expect(session.getProgress().completedCount).toBe(1);
  });

  it("accepts an unsimplified sum below one when it is already in simplest form", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    session.recordAnswer({ values: answer({ numerator: "4", denominator: "10" }) });
    session.recordAnswer({ values: answer({
      numerator: "9", denominator: "10"
    }) });
    expect(session.getProgress().completedCount).toBe(2);
    expect(session.getCurrentTask().id).toBe("FSD1-03");
  });

  it("requires a whole-number field when the sum is greater than one", () => {
    const session = createFractionSameDenominatorAdditionSession({ learnerKey: "Zyon", storage: memoryStorage() });
    for (let i = 0; i < 2; i++) session.recordAnswer({ values: answer({
      numerator: i === 0 ? "4" : "9", denominator: "10",
      simplified: i === 0, simplifiedNumerator: "2", simplifiedDenominator: "5"
    }) });
    expect(session.recordAnswer({ values: answer({ numerator: "1", denominator: "10" }) }).classification)
      .toBe("requires_mixed_number");
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "10"
    }) }).classification).toBe("valid");
  });

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
      expect(session.recordAnswer({ values }).classification).toBe("valid");
      expect(task).toBeTruthy();
    }
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "1", numerator: "8", denominator: "10"
    }) }).classification).toBe("requires_simplification");
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "1", numerator: "8", denominator: "10",
      simplified: true, simplifiedNumerator: "4", simplifiedDenominator: "5"
    }) }).classification).toBe("valid");
  });

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
      });
      session.recordAnswer({ values });
    }
    expect(session.recordAnswer({ values: answer({
      wholeNumberEnabled: true, wholeNumber: "2", numerator: "8", denominator: "10"
    }) }).classification).toBe("incorrect_answer");
  });
});
