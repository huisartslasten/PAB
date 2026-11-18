import { areEquivalentFractionValues, isFractionInLowestTerms } from "./fraction-answer-validation.js";
import { FRACTION_UNLIKE_DENOMINATOR_SUBTRACTION_TASKS } from "./fraction-unlike-denominator-subtraction-task-bank.js";

function gcd(a, b) { while (b !== 0) [a, b] = [b, a % b]; return a; }
function lcm(a, b) { return a / gcd(a, b) * b; }
function expectedFor(task) {
  const denominator = lcm(task.leftFraction.denominator, task.rightFraction.denominator);
  const numerator = task.leftFraction.numerator * (denominator / task.leftFraction.denominator) -
    task.rightFraction.numerator * (denominator / task.rightFraction.denominator);
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ numerator, denominator, reducedNumerator: numerator / divisor,
    reducedDenominator: denominator / divisor, requiresSimplification: divisor > 1 });
}

function createFractionUnlikeDenominatorSubtractionSession({
  learnerKey, storage = globalThis.localStorage, tasks = FRACTION_UNLIKE_DENOMINATOR_SUBTRACTION_TASKS
} = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length !== 15) throw new TypeError("Exactly 15 subtraction tasks are required.");
  const normalized = Object.freeze(tasks.map((task, index) => {
    const left = task?.leftFraction, right = task?.rightFraction;
    if (!task?.id || !left || !right ||
        ![left.numerator,left.denominator,right.numerator,right.denominator].every(Number.isSafeInteger) ||
        left.denominator < 2 || right.denominator < 2 || left.denominator === right.denominator ||
        left.numerator <= 0 || left.numerator >= left.denominator ||
        right.numerator <= 0 || right.numerator >= right.denominator ||
        left.numerator * right.denominator <= right.numerator * left.denominator) {
      throw new TypeError("Task " + index + " must contain two positive, proper, unlike-denominator fractions with a positive difference.");
    }
    return Object.freeze({ id: task.id, leftFraction: Object.freeze({...left}), rightFraction: Object.freeze({...right}),
      result: expectedFor(task) });
  }));
  if (new Set(normalized.map(task => task.id)).size !== 15) throw new TypeError("Task IDs must be unique.");
  const key = "pacogo:fraction-unlike-denominator-subtraction:v1:" + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], attemptsByTask: {} });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("Saved unlike-denominator subtraction progress is unreadable."); }
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.completedTaskIds) ||
        !value.attemptsByTask || typeof value.attemptsByTask !== "object") {
      throw new Error("Saved unlike-denominator subtraction progress has an unsupported format.");
    }
    return {
      schemaVersion: 1,
      completedTaskIds: value.completedTaskIds.filter(id => normalized.some(task => task.id === id)),
      attemptsByTask: Object.fromEntries(normalized.map(task => [task.id,
        Number.isSafeInteger(value.attemptsByTask[task.id]) && value.attemptsByTask[task.id] >= 0 ? value.attemptsByTask[task.id] : 0]))
    };
  }
  function getCurrentTask() {
    const state = read(), task = normalized.find(item => !state.completedTaskIds.includes(item.id));
    if (!task) return null;
    return Object.freeze({...task, taskNumber: normalized.indexOf(task) + 1, totalTasks: 15});
  }
  function getProgress() {
    const state = read(), completedCount = state.completedTaskIds.length;
    return Object.freeze({ completedCount, totalCount: 15,
      attemptCount: Object.values(state.attemptsByTask).reduce((sum,count)=>sum+count,0),
      isComplete: completedCount === 15 });
  }
  function recordAnswer({ numerator, denominator, simplified = false, simplifiedNumerator, simplifiedDenominator } = {}) {
    const task = getCurrentTask();
    if (!task) throw new Error("The unlike-denominator subtraction practice is complete.");
    const integer = value => /^[0-9]+$/.test(String(value ?? "").trim()) ? Number(String(value).trim()) : NaN;
    const n = integer(numerator), d = integer(denominator);
    const validPrimary = Number.isSafeInteger(n) && n > 0 && Number.isSafeInteger(d) && d > 0 &&
      areEquivalentFractionValues({numerator:n,denominator:d}, task.result);
    let classification = "incorrect_answer";
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || n <= 0 || d <= 0) classification = "invalid_input";
    else if (!validPrimary) classification = "incorrect_answer";
    else if (!isFractionInLowestTerms(n,d) && !simplified) classification = "simplification_required";
    else if (simplified) {
      const sn = integer(simplifiedNumerator), sd = integer(simplifiedDenominator);
      if (!Number.isSafeInteger(sn) || !Number.isSafeInteger(sd) || sn <= 0 || sd <= 0) classification = "invalid_simplification";
      else if (!isFractionInLowestTerms(sn,sd) ||
          !areEquivalentFractionValues({numerator:sn,denominator:sd},{numerator:n,denominator:d}) ||
          !areEquivalentFractionValues({numerator:sn,denominator:sd},task.result)) classification = "incorrect_simplification";
      else classification = "valid";
    } else classification = "valid";
    const state = read();
    state.attemptsByTask[task.id] = (state.attemptsByTask[task.id] || 0) + 1;
    if (classification === "valid") state.completedTaskIds.push(task.id);
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, correct: classification === "valid", progress: getProgress() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}
export { createFractionUnlikeDenominatorSubtractionSession, expectedFor };
