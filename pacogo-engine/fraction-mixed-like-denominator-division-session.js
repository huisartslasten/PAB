import { greatestCommonDivisor } from "./fraction-answer-validation.js";

const STORAGE_KEY = "pacogo:fraction-mixed-like-denominator-division:v1:";

function createFractionMixedLikeDenominatorDivisionSession({ learnerKey, storage = globalThis.localStorage, tasks } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length !== 15) throw new TypeError("Exactly 15 mixed-number division tasks are required.");

  const normalized = Object.freeze(tasks.map((task, index) => {
    const { left, right, answer } = task || {};
    const values = [left?.whole, left?.numerator, left?.denominator, right?.whole, right?.numerator, right?.denominator, answer?.whole, answer?.numerator, answer?.denominator];
    if (!task?.id || typeof task.id !== "string" || !left || !right || !answer ||
        !values.every(Number.isSafeInteger) ||
        left.whole < 1 || right.whole < 1 || left.numerator <= 0 || right.numerator <= 0 ||
        left.denominator <= left.numerator || right.denominator <= right.numerator ||
        left.denominator !== right.denominator ||
        answer.whole < 1 || answer.numerator <= 0 || answer.denominator <= answer.numerator ||
        greatestCommonDivisor(answer.numerator, answer.denominator) !== 1) {
      throw new TypeError("Task " + index + " must contain two proper mixed numbers with like denominators and a simplified mixed-number quotient greater than one.");
    }
    const leftNumerator = left.whole * left.denominator + left.numerator;
    const rightNumerator = right.whole * right.denominator + right.numerator;
    const answerNumerator = answer.whole * answer.denominator + answer.numerator;
    if (leftNumerator <= rightNumerator ||
        leftNumerator * answer.denominator !== answerNumerator * rightNumerator) {
      throw new TypeError("Task " + index + " has an invalid order or division answer.");
    }
    return Object.freeze({
      id: task.id,
      left: Object.freeze({ ...left }),
      right: Object.freeze({ ...right }),
      answer: Object.freeze({ ...answer })
    });
  }));
  if (new Set(normalized.map(task => task.id)).size !== 15 ||
      new Set(normalized.map(task => [task.left.whole, task.left.numerator, task.left.denominator, task.right.whole, task.right.numerator, task.right.denominator].join("|"))).size !== 15) {
    throw new TypeError("Task IDs and division questions must be unique.");
  }

  const key = STORAGE_KEY + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], responsesByTask: {} });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let state;
    try { state = JSON.parse(raw); } catch { throw new Error("Saved mixed-number division practice is unreadable."); }
    if (!state || state.schemaVersion !== 1 || !Array.isArray(state.completedTaskIds) ||
        !state.responsesByTask || typeof state.responsesByTask !== "object") {
      throw new Error("Saved mixed-number division practice has an unsupported format.");
    }
    return {
      schemaVersion: 1,
      completedTaskIds: state.completedTaskIds.filter(id => normalized.some(task => task.id === id)),
      responsesByTask: Object.fromEntries(Object.entries(state.responsesByTask).filter(([id, responses]) =>
        normalized.some(task => task.id === id) && Array.isArray(responses)))
    };
  }
  function getCurrentTask() {
    const state = read();
    const task = normalized.find(item => !state.completedTaskIds.includes(item.id));
    return task ? Object.freeze({ ...task, taskNumber: normalized.indexOf(task) + 1, totalTasks: 15 }) : null;
  }
  function getProgress() {
    const state = read();
    return Object.freeze({
      completedCount: state.completedTaskIds.length,
      totalCount: 15,
      attemptCount: Object.values(state.responsesByTask).reduce((sum, items) => sum + items.length, 0),
      isComplete: state.completedTaskIds.length === 15
    });
  }
  function recordAnswer({ values } = {}) {
    const task = getCurrentTask();
    if (!task) throw new Error("The mixed-number division practice is complete.");
    const value = values && typeof values === "object" ? {
      wholeNumberEnabled: values.wholeNumberEnabled === true,
      wholeNumber: String(values.wholeNumber ?? ""),
      numerator: String(values.numerator ?? ""),
      denominator: String(values.denominator ?? ""),
      simplified: values.simplified === true,
      simplifiedNumerator: String(values.simplifiedNumerator ?? ""),
      simplifiedDenominator: String(values.simplifiedDenominator ?? "")
    } : null;
    let classification = "invalid_input";
    if (value?.wholeNumberEnabled) {
      const whole = /^\d+$/.test(value.wholeNumber) ? Number(value.wholeNumber) : NaN;
      const numerator = /^\d+$/.test(value.numerator) ? Number(value.numerator) : NaN;
      const denominator = /^\d+$/.test(value.denominator) ? Number(value.denominator) : NaN;
      if ([whole, numerator, denominator].every(Number.isSafeInteger) && whole >= 0 && numerator > 0 && denominator > numerator) {
        const leftNumerator = task.left.whole * task.left.denominator + task.left.numerator;
        const rightNumerator = task.right.whole * task.right.denominator + task.right.numerator;
        const equivalent = (whole * denominator + numerator) * rightNumerator === leftNumerator * denominator;
        classification = equivalent ? "valid" : "incorrect_answer";
        if (equivalent && (greatestCommonDivisor(numerator, denominator) !== 1 ||
            whole !== task.answer.whole || numerator !== task.answer.numerator || denominator !== task.answer.denominator)) {
          classification = "requires_simplification";
        }
        if (equivalent && value.simplified) {
          const reducedNumerator = /^\d+$/.test(value.simplifiedNumerator) ? Number(value.simplifiedNumerator) : NaN;
          const reducedDenominator = /^\d+$/.test(value.simplifiedDenominator) ? Number(value.simplifiedDenominator) : NaN;
          const validReduction = Number.isSafeInteger(reducedNumerator) && Number.isSafeInteger(reducedDenominator) &&
            reducedNumerator > 0 && reducedDenominator > reducedNumerator &&
            greatestCommonDivisor(reducedNumerator, reducedDenominator) === 1 &&
            whole === task.answer.whole &&
            reducedNumerator * denominator === numerator * reducedDenominator &&
            reducedNumerator === task.answer.numerator && reducedDenominator === task.answer.denominator;
          classification = validReduction ? "valid" : "not_simplified";
        }
      } else if ([whole, numerator, denominator].every(Number.isSafeInteger)) classification = "incorrect_answer";
    }
    const state = read();
    const responses = state.responsesByTask[task.id] || [];
    responses.push({ classification, values: value || {} });
    state.responsesByTask[task.id] = responses;
    if (classification === "valid" && !state.completedTaskIds.includes(task.id)) state.completedTaskIds.push(task.id);
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, progress: getProgress() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}
export { createFractionMixedLikeDenominatorDivisionSession };
