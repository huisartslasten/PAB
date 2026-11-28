import {
  createFractionQuantityState,
  getFractionQuantityAmount,
  getFractionQuantityRemovedAmount,
  areFractionQuantitiesEqual
} from "./fraction-quantity-model.js";
import { createFractionQuantityController } from "./fraction-quantity-controller.js";
import { createPracticeSessionCore } from "./practice-session-core.js";

const DEFAULT_ALLOWED_DIVISIONS = Object.freeze([2, 3, 4]);
const REQUIRED_TASK_COUNT = 10;

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

function normalizeAmount(amount, label) {
  if (!amount || !Number.isSafeInteger(amount.whole) || amount.whole < 0 ||
      !Number.isSafeInteger(amount.numerator) || !Number.isSafeInteger(amount.denominator) ||
      amount.denominator < 1 || amount.numerator < 0 || amount.numerator >= amount.denominator) {
    throw new TypeError(label + " must be a non-negative mixed quantity");
  }
  if (amount.numerator === 0 && amount.denominator !== 1) {
    throw new TypeError(label + " must use denominator 1 when its numerator is 0");
  }
  if (amount.numerator > 0 && amount.denominator === 1) {
    throw new TypeError(label + " must use a denominator greater than 1 for a fractional part");
  }
  const improperNumerator = amount.whole * amount.denominator + amount.numerator;
  const divisor = gcd(improperNumerator, amount.denominator) || 1;
  return Object.freeze({
    whole: amount.whole,
    numerator: amount.numerator,
    denominator: amount.denominator,
    improperNumerator: improperNumerator / divisor,
    improperDenominator: amount.denominator / divisor
  });
}

function normalizeTasks(tasks, allowedDivisions) {
  if (!Array.isArray(tasks) || tasks.length !== REQUIRED_TASK_COUNT) {
    throw new TypeError("Exactly 10 subtraction tasks are required");
  }
  const ids = new Set();
  return Object.freeze(tasks.map((task, index) => {
    if (!task || typeof task.id !== "string" || !task.id.trim() || ids.has(task.id)) {
      throw new TypeError("Each subtraction task must have a unique non-empty id");
    }
    ids.add(task.id);
    if (!Number.isSafeInteger(task.wholeUnits) || task.wholeUnits < 1 || task.wholeUnits > 12) {
      throw new TypeError("Task " + index + " wholeUnits must be an integer between 1 and 12");
    }
    const subtraction = normalizeAmount(task.subtraction, "Task " + index + " subtraction");
    if (subtraction.improperNumerator <= 0 ||
        subtraction.improperNumerator >= task.wholeUnits * subtraction.improperDenominator) {
      throw new RangeError("Task " + index + " subtraction must be greater than 0 and less than the starting quantity");
    }
    if (subtraction.numerator > 0 && !allowedDivisions.includes(subtraction.denominator)) {
      throw new RangeError("Task " + index + " uses a fractional denominator that is not enabled");
    }
    const remainingNumerator =
      task.wholeUnits * subtraction.improperDenominator - subtraction.improperNumerator;
    const divisor = gcd(remainingNumerator, subtraction.improperDenominator) || 1;
    const expectedRemaining = Object.freeze({
      whole: Math.floor(remainingNumerator / subtraction.improperDenominator),
      numerator: (remainingNumerator % subtraction.improperDenominator) / divisor,
      denominator: remainingNumerator % subtraction.improperDenominator === 0
        ? 1 : subtraction.improperDenominator / divisor,
      improperNumerator: remainingNumerator / divisor,
      improperDenominator: subtraction.improperDenominator / divisor
    });
    return Object.freeze({
      id: task.id,
      wholeUnits: task.wholeUnits,
      subtraction,
      expectedRemaining
    });
  }));
}

/** Quantity-answer adapter over the shared subtraction task/progression core. */
function createFractionQuantitySubtractionSession({
  tasks,
  representation = "pie",
  allowedDivisions = DEFAULT_ALLOWED_DIVISIONS
} = {}) {
  if (!["pie", "bar"].includes(representation)) {
    throw new TypeError("representation must be pie or bar");
  }
  if (!Array.isArray(allowedDivisions) || !allowedDivisions.length ||
      allowedDivisions.some(value => !DEFAULT_ALLOWED_DIVISIONS.includes(value)) ||
      new Set(allowedDivisions).size !== allowedDivisions.length) {
    throw new TypeError("allowedDivisions must contain unique values from 2, 3 and 4");
  }

  const divisions = Object.freeze([...allowedDivisions]);
  const normalizedTasks = normalizeTasks(tasks, divisions);
  const core = createPracticeSessionCore({
    tasks: normalizedTasks,
    completionMode: "explicit"
  });
  let currentController = null;
  let lastCheck = null;
  let unsubscribe = null;

  function activateCurrentTask() {
    if (unsubscribe) unsubscribe();
    lastCheck = null;
    const task = core.getCurrentTask();
    if (!task) {
      currentController = null;
      unsubscribe = null;
      return;
    }
    currentController = createFractionQuantityController({
      initialState: createFractionQuantityState({
        wholeUnits: task.wholeUnits,
        allowedDivisions: divisions
      })
    });
    unsubscribe = currentController.subscribe(() => {
      core.invalidatePendingCompletion();
      lastCheck = null;
    });
  }

  function getCurrentTask() {
    const task = core.getCurrentTask();
    if (!task) return null;
    return Object.freeze({
      id: task.id,
      taskNumber: normalizedTasks.findIndex(item => item.id === task.id) + 1,
      totalTasks: normalizedTasks.length,
      wholeUnits: task.wholeUnits,
      subtraction: task.subtraction
    });
  }

  function getProgress() {
    const progress = core.getProgress();
    return Object.freeze({
      completedTaskCount: progress.completedCount,
      totalTaskCount: progress.totalCount,
      currentTaskNumber: progress.currentTaskId == null
        ? null : normalizedTasks.findIndex(task => task.id === progress.currentTaskId) + 1,
      attemptCount: progress.attemptCount,
      isComplete: progress.isComplete
    });
  }

  function check() {
    const task = core.getCurrentTask();
    if (!task || !currentController) throw new Error("The subtraction session is complete");
    const state = currentController.getState().state;
    const actual = getFractionQuantityAmount(state);
    const removed = getFractionQuantityRemovedAmount(state);
    const correct = areFractionQuantitiesEqual(removed, task.subtraction);
    const recorded = core.recordAttempt({
      taskId: task.id,
      classification: correct ? "valid" : "incorrect_answer",
      response: { actual, removed }
    });
    lastCheck = Object.freeze({ correct, actual, removed });
    return Object.freeze({
      correct,
      attemptCount: recorded.progress.attemptCount,
      actual,
      removed
    });
  }

  function advance() {
    const result = core.advance();
    activateCurrentTask();
    return Object.freeze({
      currentTask: getCurrentTask(),
      progress: getProgress()
    });
  }

  activateCurrentTask();

  return Object.freeze({
    representation,
    allowedDivisions: divisions,
    getCurrentTask,
    getController: () => currentController,
    getProgress,
    getLastCheck: () => lastCheck ? Object.freeze({ correct: lastCheck.correct }) : null,
    check,
    advance,
    getResults: () => {
      const state = core.getState();
      return Object.freeze(normalizedTasks.map(task => {
        const attempts = state.responsesByTask[task.id] || [];
        return Object.freeze({
          taskId: task.id,
          attemptCount: attempts.length,
          completed: state.completedTaskIds.includes(task.id)
        });
      }));
    }
  });
}

export { REQUIRED_TASK_COUNT, createFractionQuantitySubtractionSession };
