import { describe, expect, it } from "vitest";
import { FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS } from "./fraction-like-denominator-division-task-bank.js";
import { createFractionLikeDenominatorDivisionSession } from "./fraction-like-denominator-division-session.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

describe("fraction like-denominator division session", () => {
  it("contains 15 unique, exact, like-denominator proper-fraction divisions with mixed-number answers", () => {
    expect(FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS).toHaveLength(15);
    expect(new Set(FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS.map(task => task.id)).size).toBe(15);
    for (const task of FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS) {
      expect(task.left.denominator).toBe(task.right.denominator);
      expect(task.left.numerator).toBeLessThan(task.left.denominator);
      expect(task.right.numerator).toBeLessThan(task.right.denominator);
      expect(task.left.numerator).toBeGreaterThan(task.right.numerator);
      expect(task.left.numerator * task.answer.denominator).toBe(
        (task.answer.whole * task.answer.denominator + task.answer.numerator) * task.right.numerator
      );
    }
  });

  it("requires a simplified mixed-number answer, advances only after a correct answer, and can restart", () => {
    const session = createFractionLikeDenominatorDivisionSession({
      learnerKey: "test-learner", storage: createStorage(), tasks: FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS
    });
    expect(session.getCurrentTask().taskNumber).toBe(1);
    expect(session.recordAnswer({ values: { wholeNumberEnabled: true, wholeNumber: "1", numerator: "2", denominator: "6" } }).classification)
      .toBe("requires_simplification");
    expect(session.getCurrentTask().taskNumber).toBe(1);
    expect(session.recordAnswer({ values: {
      wholeNumberEnabled: true, wholeNumber: "1", numerator: "1", denominator: "3"
    } }).classification).toBe("valid");
    expect(session.getCurrentTask().taskNumber).toBe(2);
    for (const task of FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS.slice(1)) {
      const result = session.recordAnswer({ values: {
        wholeNumberEnabled: true,
        wholeNumber: String(task.answer.whole),
        numerator: String(task.answer.numerator),
        denominator: String(task.answer.denominator)
      } });
      expect(result.classification).toBe("valid");
    }
    expect(session.getProgress().isComplete).toBe(true);
    expect(session.getCurrentTask()).toBeNull();
    session.reset();
    expect(session.getCurrentTask().taskNumber).toBe(1);
  });

  it("rejects invalid task contracts", () => {
    expect(() => createFractionLikeDenominatorDivisionSession({
      learnerKey: "x", storage: createStorage(), tasks: FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS.slice(0, 14)
    })).toThrow(/Exactly 15/);
  });
});
