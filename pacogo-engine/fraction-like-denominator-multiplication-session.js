import { areEquivalentFractionValues, greatestCommonDivisor, isFractionInLowestTerms } from "./fraction-answer-validation.js";

function createFractionLikeDenominatorMultiplicationSession({
  learnerKey,
  storage = globalThis.localStorage,
  tasks
} = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length !== 15) {
    throw new TypeError("Exactly 15 multiplication tasks are required.");
  }
  const normalized = Object.freeze(tasks.map((task, index) => {
    const left = task?.leftFraction, right = task?.rightFraction, result = task?.result;
    if (!task?.id || typeof task.id !== "string" ||
        !left || !right || !result ||
        !Number.isSafeInteger(left.numerator) || !Number.isSafeInteger(right.numerator) ||
        !Number.isSafeInteger(left.denominator) || !Number.isSafeInteger(right.denominator) ||
        left.denominator !== right.denominator ||
        left.numerator <= 0 || left.numerator >= left.denominator ||
        right.numerator <= 0 || right.numerator >= right.denominator ||
        !Number.isSafeInteger(result.numerator) || !Number.isSafeInteger(result.denominator) ||
        result.numerator !== left.numerator * right.numerator ||
        result.denominator !== left.denominator * right.denominator) {
      throw new TypeError("Task " + index + " must multiply two positive proper fractions with the same denominator and contain their exact product.");
    }
    return Object.freeze({
      id: task.id,
      leftFraction: Object.freeze({ ...left }),
      rightFraction: Object.freeze({ ...right }),
      result: Object.freeze({ ...result })
    });
  }));
  if (new Set(normalized.map(task => task.id)).size !== 15 ||
      new Set(normalized.map(task => [
        task.leftFraction.numerator, task.leftFraction.denominator,
        task.rightFraction.numerator, task.rightFraction.denominator
      ].join("|"))).size !== 15) {
    throw new TypeError("Task IDs and multiplication questions must be unique.");
  }

  const key = "pacogo:fraction-like-denominator-multiplication:v1:" + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], attemptsByTask: {} });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("Saved multiplication progress is unreadable."); }
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.completedTaskIds) ||
        !value.attemptsByTask || typeof value.attemptsByTask !== "object") {
      throw new Error("Saved multiplication progress has an unsupported format.");
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
    if (!task) throw new Error("The multiplication practice is complete.");
    const validInteger = value => /^[0-9]+$/.test(String(value ?? "").trim());
    const n = String(numerator ?? "").trim(), d = String(denominator ?? "").trim();
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
export { createFractionLikeDenominatorMultiplicationSession };
