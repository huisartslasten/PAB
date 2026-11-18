import { areEquivalentFractionValues, greatestCommonDivisor, isFractionInLowestTerms } from "./fraction-answer-validation.js";

const FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS = Object.freeze([
  [8,9,3,9],[7,10,4,10],[11,12,5,12],[5,8,2,8],[9,10,6,10],
  [7,9,5,9],[10,12,3,12],[6,7,4,7],[8,10,3,10],[11,12,8,12],
  [7,8,2,8],[9,10,7,10],[10,12,4,12],[5,6,1,6],[8,12,5,12]
].map(([leftNumerator, denominator, rightNumerator], index) => Object.freeze({
  id: "fraction-like-denominator-subtraction-" + String(index + 1).padStart(2, "0"),
  leftFraction: Object.freeze({ numerator: leftNumerator, denominator }),
  rightFraction: Object.freeze({ numerator: rightNumerator, denominator }),
  result: Object.freeze({ numerator: leftNumerator - rightNumerator, denominator })
})));

function createFractionLikeDenominatorSubtractionSession({
  learnerKey,
  storage = globalThis.localStorage,
  tasks = FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS
} = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length === 0) throw new TypeError("At least one task is required.");
  const normalized = Object.freeze(tasks.map((task, index) => {
    const left = task?.leftFraction, right = task?.rightFraction;
    if (!task?.id || typeof task.id !== "string" ||
        !left || !right || !Number.isSafeInteger(left.numerator) ||
        !Number.isSafeInteger(right.numerator) || !Number.isSafeInteger(left.denominator) ||
        left.denominator !== right.denominator || left.numerator <= right.numerator ||
        right.numerator <= 0 || left.numerator >= left.denominator) {
      throw new TypeError("Task " + index + " must contain positive, proper like-denominator fractions with a positive difference.");
    }
    return Object.freeze({
      id: task.id,
      leftFraction: Object.freeze({ ...left }),
      rightFraction: Object.freeze({ ...right }),
      result: Object.freeze({ numerator: left.numerator - right.numerator, denominator: left.denominator })
    });
  }));
  if (new Set(normalized.map(task => task.id)).size !== normalized.length) {
    throw new TypeError("Task IDs must be unique.");
  }
  const key = "pacogo:fraction-like-denominator-subtraction:v1:" + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], attemptsByTask: {} });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("Saved subtraction progress is unreadable."); }
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.completedTaskIds) ||
        !value.attemptsByTask || typeof value.attemptsByTask !== "object") {
      throw new Error("Saved subtraction progress has an unsupported format.");
    }
    return {
      schemaVersion: 1,
      completedTaskIds: value.completedTaskIds.filter(id => normalized.some(task => task.id === id)),
      attemptsByTask: Object.fromEntries(normalized.map(task => [
        task.id, Number.isSafeInteger(value.attemptsByTask[task.id]) && value.attemptsByTask[task.id] >= 0
          ? value.attemptsByTask[task.id] : 0
      ]))
    };
  }
  function getCurrentTask() {
    const state = read();
    const task = normalized.find(item => !state.completedTaskIds.includes(item.id));
    if (!task) return null;
    return Object.freeze({
      ...task,
      taskNumber: normalized.indexOf(task) + 1,
      totalTasks: normalized.length
    });
  }
  function getProgress() {
    const state = read();
    const completedCount = state.completedTaskIds.length;
    return Object.freeze({
      completedCount,
      totalCount: normalized.length,
      attemptCount: Object.values(state.attemptsByTask).reduce((sum, count) => sum + count, 0),
      isComplete: completedCount === normalized.length
    });
  }
  function recordAnswer({
    numerator, denominator, simplified = false,
    simplifiedNumerator, simplifiedDenominator
  } = {}) {
    const task = getCurrentTask();
    if (!task) throw new Error("The subtraction practice is complete.");
    const n = String(numerator ?? "").trim(), d = String(denominator ?? "").trim();
    const validInteger = value => /^[0-9]+$/.test(value);
    const primaryNumerator = validInteger(n) ? Number(n) : NaN;
    const primaryDenominator = validInteger(d) ? Number(d) : NaN;
    const primaryValid = Number.isSafeInteger(primaryNumerator) && primaryNumerator > 0 &&
      Number.isSafeInteger(primaryDenominator) && primaryDenominator > 0 &&
      areEquivalentFractionValues(
        { numerator: primaryNumerator, denominator: primaryDenominator },
        task.result
      );
    const sn = String(simplifiedNumerator ?? "").trim();
    const sd = String(simplifiedDenominator ?? "").trim();
    const simplifiedValue = {
      numerator: validInteger(sn) ? Number(sn) : NaN,
      denominator: validInteger(sd) ? Number(sd) : NaN
    };
    let classification = "incorrect_answer";
    if (!validInteger(n) || !validInteger(d) || primaryNumerator <= 0 || primaryDenominator <= 0) {
      classification = "invalid_input";
    } else if (!primaryValid) {
      classification = "incorrect_answer";
    } else if (!isFractionInLowestTerms(primaryNumerator, primaryDenominator) && !simplified) {
      classification = "simplification_required";
    } else if (simplified && (!Number.isSafeInteger(simplifiedValue.numerator) ||
        !Number.isSafeInteger(simplifiedValue.denominator) || simplifiedValue.numerator <= 0 ||
        simplifiedValue.denominator <= 0)) {
      classification = "invalid_simplification";
    } else if (simplified && (!isFractionInLowestTerms(simplifiedValue.numerator, simplifiedValue.denominator) ||
        !areEquivalentFractionValues(simplifiedValue, { numerator: primaryNumerator, denominator: primaryDenominator }) ||
        !areEquivalentFractionValues(simplifiedValue, task.result))) {
      classification = "incorrect_simplification";
    } else {
      classification = "valid";
    }
    const state = read();
    state.attemptsByTask[task.id] = (state.attemptsByTask[task.id] || 0) + 1;
    if (classification === "valid") state.completedTaskIds.push(task.id);
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, correct: classification === "valid", progress: getProgress() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}

export { FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS, createFractionLikeDenominatorSubtractionSession };
