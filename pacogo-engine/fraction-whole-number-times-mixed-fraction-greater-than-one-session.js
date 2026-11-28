const FRACTION_WHOLE_NUMBER_TIMES_MIXED_FRACTION_GREATER_THAN_ONE_KEY = "pacogo:fraction-whole-number-times-mixed-fraction-greater-than-one:v1:";
const RESPONSE_CLASSIFICATIONS = Object.freeze(["valid", "invalid_input", "incorrect_answer", "requires_simplification", "not_simplified"]);
function greatestCommonDivisor(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
function createFractionWholeNumberTimesMixedFractionGreaterThanOneSession({ learnerKey, storage = globalThis.localStorage, tasks } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length !== 15) throw new TypeError("Exactly 15 multiplication tasks are required.");
  const normalized = Object.freeze(tasks.map((task, index) => {
    const { wholeNumber, multiplier, answer } = task || {};
    if (!task?.id || typeof task.id !== "string" ||
        !Number.isSafeInteger(wholeNumber) || wholeNumber <= 0 ||
        !multiplier || !Number.isSafeInteger(multiplier.whole) || multiplier.whole < 1 ||
        !Number.isSafeInteger(multiplier.numerator) || multiplier.numerator <= 0 ||
        !Number.isSafeInteger(multiplier.denominator) || multiplier.denominator <= multiplier.numerator ||
        !answer || !Number.isSafeInteger(answer.whole) || answer.whole <= 0 ||
        !Number.isSafeInteger(answer.numerator) || answer.numerator <= 0 ||
        !Number.isSafeInteger(answer.denominator) || answer.denominator <= answer.numerator ||
        greatestCommonDivisor(answer.numerator, answer.denominator) !== 1) {
      throw new TypeError("Task " + index + " must contain a whole number times a mixed number greater than one and a simplified mixed-number answer.");
    }
    const expectedNumerator = wholeNumber * (multiplier.whole * multiplier.denominator + multiplier.numerator);
    const expectedDenominator = multiplier.denominator;
    const answerNumerator = answer.whole * answer.denominator + answer.numerator;
    if (expectedNumerator * answer.denominator !== answerNumerator * expectedDenominator) {
      throw new TypeError("Task " + index + " has an incorrect answer.");
    }
    return Object.freeze({
      id: task.id, wholeNumber,
      multiplier: Object.freeze({ ...multiplier }),
      answer: Object.freeze({ ...answer })
    });
  }));
  if (new Set(normalized.map(task => task.id)).size !== 15 ||
      new Set(normalized.map(task => [task.wholeNumber, task.multiplier.whole, task.multiplier.numerator, task.multiplier.denominator].join("|"))).size !== 15) {
    throw new TypeError("Task IDs and multiplication questions must be unique.");
  }
  const key = FRACTION_WHOLE_NUMBER_TIMES_MIXED_FRACTION_GREATER_THAN_ONE_KEY + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], responsesByTask: {} });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("Saved multiplication practice is unreadable."); }
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.completedTaskIds) ||
        !value.responsesByTask || typeof value.responsesByTask !== "object") {
      throw new Error("Saved multiplication practice has an unsupported format.");
    }
    const completedTaskIds = value.completedTaskIds.filter(id => normalized.some(task => task.id === id));
    const responsesByTask = {};
    for (const [id, responses] of Object.entries(value.responsesByTask)) {
      if (!normalized.some(task => task.id === id) || !Array.isArray(responses)) continue;
      if (responses.some(response => !response || !RESPONSE_CLASSIFICATIONS.includes(response.classification) ||
          !response.values || typeof response.values !== "object")) {
        throw new Error("Saved multiplication practice contains an invalid response.");
      }
      responsesByTask[id] = responses.map(response => ({ classification: response.classification, values: { ...response.values } }));
    }
    return { schemaVersion: 1, completedTaskIds, responsesByTask };
  }
  function getCurrentTask() {
    const state = read();
    const task = normalized.find(item => !state.completedTaskIds.includes(item.id));
    if (!task) return null;
    return Object.freeze({ ...task, taskNumber: normalized.indexOf(task) + 1, totalTasks: normalized.length });
  }
  function getProgress() {
    const state = read();
    const completedCount = state.completedTaskIds.length;
    return Object.freeze({
      completedCount, totalCount: normalized.length,
      attemptCount: Object.values(state.responsesByTask).reduce((sum, responses) => sum + responses.length, 0),
      isComplete: completedCount === normalized.length
    });
  }
  function recordAnswer({ values } = {}) {
    const task = getCurrentTask();
    if (!task) throw new Error("The multiplication practice is complete.");
    const normalizedValues = values && typeof values === "object" ? {
      wholeNumberEnabled: values.wholeNumberEnabled === true,
      wholeNumber: String(values.wholeNumber ?? ""),
      numerator: String(values.numerator ?? ""),
      denominator: String(values.denominator ?? ""),
      simplified: values.simplified === true,
      simplifiedNumerator: String(values.simplifiedNumerator ?? ""),
      simplifiedDenominator: String(values.simplifiedDenominator ?? "")
    } : null;
    let classification = "invalid_input";
    if (normalizedValues?.wholeNumberEnabled) {
      const raw = [normalizedValues.wholeNumber, normalizedValues.numerator, normalizedValues.denominator];
      const numbers = raw.map(value => /^[0-9]+$/.test(value) ? Number(value) : NaN);
      const [whole, numerator, denominator] = numbers;
      if (numbers.every(Number.isSafeInteger) && whole >= 0 && numerator > 0 && denominator > numerator) {
        const equivalent = (whole * denominator + numerator) * task.answer.denominator ===
          (task.answer.whole * task.answer.denominator + task.answer.numerator) * denominator;
        classification = equivalent ? "valid" : "incorrect_answer";
        if (equivalent && greatestCommonDivisor(numerator, denominator) !== 1) {
          classification = "requires_simplification";
        }
        if (equivalent && normalizedValues.simplified) {
          const reducedNumerator = /^[0-9]+$/.test(normalizedValues.simplifiedNumerator) ? Number(normalizedValues.simplifiedNumerator) : NaN;
          const reducedDenominator = /^[0-9]+$/.test(normalizedValues.simplifiedDenominator) ? Number(normalizedValues.simplifiedDenominator) : NaN;
          const reducedValid = Number.isSafeInteger(reducedNumerator) && Number.isSafeInteger(reducedDenominator) &&
            reducedNumerator > 0 && reducedDenominator > reducedNumerator &&
            greatestCommonDivisor(reducedNumerator, reducedDenominator) === 1 &&
            reducedNumerator * denominator === numerator * reducedDenominator &&
            whole === task.answer.whole &&
            reducedNumerator * task.answer.denominator === task.answer.numerator * reducedDenominator;
          classification = reducedValid ? "valid" : "not_simplified";
        }
      } else if (numbers.every(Number.isSafeInteger)) classification = "incorrect_answer";
    }
    const state = read();
    const responses = state.responsesByTask[task.id] || [];
    responses.push({ classification, values: normalizedValues || {} });
    state.responsesByTask[task.id] = responses;
    if (classification === "valid" && !state.completedTaskIds.includes(task.id)) state.completedTaskIds.push(task.id);
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, progress: getProgress() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}
export { createFractionWholeNumberTimesMixedFractionGreaterThanOneSession };
