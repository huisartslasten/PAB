import { greatestCommonDivisor } from "./fraction-answer-validation.js";

const STEP_IDS = Object.freeze(["convert_mixed_numbers", "invert_divisor", "multiply_fractions", "convert_to_mixed_number", "simplify_quotient"]);
const CLASSIFICATIONS = Object.freeze(["valid", "invalid_input", "incorrect_answer", "requires_simplification", "not_simplified"]);
const STORAGE_PREFIX = "pacogo:fraction-mixed-unlike-denominator-division-guided:v1:";
const parse = value => /^[0-9]+$/.test(String(value ?? "")) ? Number(value) : NaN;

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length !== 10) throw new TypeError("Exactly 10 guided mixed-number division tasks are required.");
  const ids = new Set();
  return Object.freeze(tasks.map((task, index) => {
    const { left, right, answer } = task || {};
    const values = [left?.whole,left?.numerator,left?.denominator,right?.whole,right?.numerator,right?.denominator,answer?.whole,answer?.numerator,answer?.denominator];
    if (typeof task?.id !== "string" || !task.id || ids.has(task.id) || !left || !right || !answer ||
        !values.every(Number.isSafeInteger) || left.whole < 1 || right.whole < 1 ||
        left.numerator <= 0 || left.numerator >= left.denominator || right.numerator <= 0 || right.numerator >= right.denominator ||
        left.denominator === right.denominator || answer.whole < 1 || answer.numerator <= 0 || answer.numerator >= answer.denominator ||
        greatestCommonDivisor(answer.numerator, answer.denominator) !== 1) {
      throw new TypeError("Task " + index + " must contain two proper mixed numbers with unlike denominators and a simplified mixed quotient.");
    }
    const leftImproper = left.whole * left.denominator + left.numerator;
    const rightImproper = right.whole * right.denominator + right.numerator;
    const productNumerator = leftImproper * right.denominator;
    const productDenominator = left.denominator * rightImproper;
    const whole = Math.floor(productNumerator / productDenominator);
    const remainder = productNumerator % productDenominator;
    const answerNumerator = answer.whole * answer.denominator + answer.numerator;
    if (leftImproper <= rightImproper || whole < 1 ||
        answer.whole !== whole ||
        remainder * answer.denominator !== answer.numerator * productDenominator ||
        answerNumerator * productDenominator !== productNumerator * answer.denominator) {
      throw new TypeError("Task " + index + " has an invalid division order or answer.");
    }
    ids.add(task.id);
    return Object.freeze({
      id: task.id,
      left: Object.freeze({ ...left }),
      right: Object.freeze({ ...right }),
      leftImproper,
      rightImproper,
      inverse: Object.freeze({ numerator: right.denominator, denominator: rightImproper }),
      product: Object.freeze({ numerator: leftImproper * right.denominator, denominator: left.denominator * rightImproper }),
      mixed: Object.freeze({ whole, numerator: remainder, denominator: productDenominator }),
      answer: Object.freeze({ ...answer })
    });
  }));
}

function createFractionMixedUnlikeDenominatorDivisionGuidedSession({ learnerKey, storage = globalThis.localStorage, tasks } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") throw new TypeError("A compatible local storage object is required.");
  const configured = normalizeTasks(tasks);
  const key = STORAGE_PREFIX + encodeURIComponent(learner);
  const empty = () => ({
    schemaVersion: 1,
    completedTaskIds: [],
    completedStepIdsByTask: Object.fromEntries(configured.map(task => [task.id, []])),
    responsesByTask: Object.fromEntries(configured.map(task => [task.id, []]))
  });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let state;
    try { state = JSON.parse(raw); } catch { throw new Error("Saved guided mixed-number division practice is unreadable."); }
    if (!state || state.schemaVersion !== 1 || !Array.isArray(state.completedTaskIds) || !state.completedStepIdsByTask || !state.responsesByTask) throw new Error("Saved guided mixed-number division practice has an unsupported format.");
    const completedStepIdsByTask = {}, responsesByTask = {};
    for (const task of configured) {
      const steps = state.completedStepIdsByTask[task.id] || [];
      const responses = state.responsesByTask[task.id] || [];
      if (!Array.isArray(steps) || steps.some((id, index) => STEP_IDS[index] !== id) || steps.length > STEP_IDS.length ||
          !Array.isArray(responses) || responses.some(response => !response || !STEP_IDS.includes(response.stepId) || !CLASSIFICATIONS.includes(response.classification) || !response.values || typeof response.values !== "object")) {
        throw new Error("Saved guided mixed-number division practice contains an invalid step sequence.");
      }
      completedStepIdsByTask[task.id] = [...steps];
      responsesByTask[task.id] = responses.map(response => ({ ...response, values: { ...response.values } }));
    }
    return {
      schemaVersion: 1,
      completedTaskIds: state.completedTaskIds.filter(id => configured.some(task => task.id === id)),
      completedStepIdsByTask,
      responsesByTask
    };
  }
  function current() {
    const state = read();
    const task = configured.find(item => !state.completedTaskIds.includes(item.id));
    if (!task) return null;
    const completedStepIds = state.completedStepIdsByTask[task.id];
    return Object.freeze({
      task,
      taskNumber: configured.indexOf(task) + 1,
      totalTasks: 10,
      stepId: STEP_IDS[completedStepIds.length],
      stepNumber: completedStepIds.length + 1,
      totalSteps: STEP_IDS.length,
      completedStepIds: Object.freeze([...completedStepIds])
    });
  }
  function progress() {
    const state = read();
    const completedCount = state.completedTaskIds.length;
    return Object.freeze({
      completedCount,
      totalCount: 10,
      completedStepCount: configured.reduce((count, task) => count + state.completedStepIdsByTask[task.id].length, 0),
      totalStepCount: 50,
      attemptCount: configured.reduce((count, task) => count + state.responsesByTask[task.id].length, 0),
      isComplete: completedCount === 10
    });
  }
  function recordResponse({ values } = {}) {
    const step = current();
    if (!step) throw new Error("The guided mixed-number division practice is complete.");
    const task = step.task;
    const input = values && typeof values === "object" ? values : {};
    let classification = "invalid_input";
    let stored = {};
    if (step.stepId === "convert_mixed_numbers") {
      const leftNumerator = parse(input.leftNumerator);
      const leftDenominator = parse(input.leftDenominator);
      const rightNumerator = parse(input.rightNumerator);
      const rightDenominator = parse(input.rightDenominator);
      if ([leftNumerator,leftDenominator,rightNumerator,rightDenominator].every(Number.isSafeInteger) &&
          leftNumerator > 0 && leftDenominator > 0 && rightNumerator > 0 && rightDenominator > 0) {
        classification = leftNumerator === task.leftImproper && leftDenominator === task.left.denominator &&
          rightNumerator === task.rightImproper && rightDenominator === task.right.denominator ? "valid" : "incorrect_answer";
      }
      stored = Object.fromEntries(["leftNumerator","leftDenominator","rightNumerator","rightDenominator"].map(name => [name,String(input[name] ?? "")]));
    } else if (step.stepId === "invert_divisor") {
      const numerator = parse(input.numerator), denominator = parse(input.denominator);
      if ([numerator,denominator].every(Number.isSafeInteger) && numerator > 0 && denominator > 0) {
        classification = numerator === task.inverse.numerator && denominator === task.inverse.denominator ? "valid" : "incorrect_answer";
      }
      stored = { numerator: String(input.numerator ?? ""), denominator: String(input.denominator ?? "") };
    } else if (step.stepId === "multiply_fractions") {
      const numerator = parse(input.numerator), denominator = parse(input.denominator);
      if ([numerator,denominator].every(Number.isSafeInteger) && numerator > 0 && denominator > 0) {
        classification = numerator === task.product.numerator && denominator === task.product.denominator ? "valid" : "incorrect_answer";
      }
      stored = { numerator: String(input.numerator ?? ""), denominator: String(input.denominator ?? "") };
    } else if (step.stepId === "convert_to_mixed_number") {
      const whole = parse(input.wholeNumber), remainder = parse(input.remainder);
      if ([whole,remainder].every(Number.isSafeInteger) && whole >= 1 && remainder >= 0 && remainder < task.product.denominator) {
        classification = whole === task.mixed.whole && remainder === task.mixed.numerator ? "valid" : "incorrect_answer";
      }
      stored = { wholeNumber: String(input.wholeNumber ?? ""), remainder: String(input.remainder ?? "") };
    } else if (step.stepId === "simplify_quotient") {
      const whole = parse(input.wholeNumber), numerator = parse(input.numerator), denominator = parse(input.denominator);
      if ([whole,numerator,denominator].every(Number.isSafeInteger) && whole >= 1 && numerator > 0 && denominator > numerator) {
        const equivalent = (whole * denominator + numerator) * task.mixed.denominator ===
          (task.mixed.whole * task.mixed.denominator + task.mixed.numerator) * denominator;
        if (!equivalent) classification = "incorrect_answer";
        else if (greatestCommonDivisor(numerator,denominator) !== 1) classification = "requires_simplification";
        else if (whole !== task.answer.whole || numerator !== task.answer.numerator || denominator !== task.answer.denominator) classification = "not_simplified";
        else classification = "valid";
      }
      stored = { wholeNumber: String(input.wholeNumber ?? ""), numerator: String(input.numerator ?? ""), denominator: String(input.denominator ?? "") };
    }
    const state = read();
    const responses = state.responsesByTask[task.id];
    responses.push({ stepId: step.stepId, classification, values: stored });
    state.responsesByTask[task.id] = responses;
    if (classification === "valid") {
      const completed = state.completedStepIdsByTask[task.id];
      completed.push(step.stepId);
      if (completed.length === STEP_IDS.length) state.completedTaskIds.push(task.id);
    }
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, progress: progress(), currentStep: current() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentStep: current, getProgress: progress, recordResponse, reset });
}
export { createFractionMixedUnlikeDenominatorDivisionGuidedSession };
