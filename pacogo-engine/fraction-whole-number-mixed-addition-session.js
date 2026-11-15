const CLASSIFICATIONS = Object.freeze(["valid", "invalid_input", "incorrect_answer", "requires_simplification", "not_simplified"]);

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) [left, right] = [right, left % right];
  return left;
}

function normalizeTask(task) {
  if (!task || typeof task !== "object") throw new TypeError("A fraction addition task is required.");
  const values = [task.wholeNumber, task.numerator, task.denominator, task.addend];
  if (!values.every(Number.isSafeInteger) || values.some(value => value < 0) || task.denominator < 1 || task.numerator >= task.denominator) {
    throw new TypeError("The task must contain a non-negative whole number, a proper fraction and a positive denominator.");
  }
  return Object.freeze({
    id: String(task.id || "whole-number-plus-mixed-fraction"),
    addend: task.addend,
    wholeNumber: task.wholeNumber,
    numerator: task.numerator,
    denominator: task.denominator
  });
}

function createWholeNumberMixedFractionAdditionSession({ learnerKey, task, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  const currentTask = normalizeTask(task);
  const key = "pacogo:fraction-whole-number-mixed-addition:v1:" + encodeURIComponent(learner) + ":" + encodeURIComponent(currentTask.id);
  const empty = () => ({ schemaVersion: 1, completed: false, responses: [] });

  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let state;
    try { state = JSON.parse(raw); } catch { throw new Error("Saved whole-number fraction addition is unreadable."); }
    if (!state || state.schemaVersion !== 1 || typeof state.completed !== "boolean" || !Array.isArray(state.responses)) {
      throw new Error("Saved whole-number fraction addition has an unsupported format.");
    }
    if (state.responses.some(item => !item || !CLASSIFICATIONS.includes(item.classification) || !item.values || typeof item.values !== "object")) {
      throw new Error("Saved whole-number fraction addition contains an invalid response.");
    }
    return { schemaVersion: 1, completed: state.completed, responses: state.responses.map(item => ({ classification: item.classification, values: { ...item.values } })) };
  }

  function getCurrentTask() {
    return read().completed ? null : Object.freeze({ ...currentTask, resultWholeNumber: currentTask.addend + currentTask.wholeNumber });
  }

  function getProgress() {
    const state = read();
    return Object.freeze({ attemptCount: state.responses.length, isComplete: state.completed });
  }

  function getCompletion() {
    const state = read();
    if (!state.completed) return null;
    const valid = [...state.responses].reverse().find(item => item.classification === "valid");
    return valid ? Object.freeze({ ...valid.values }) : null;
  }

  function recordResponse({ values } = {}) {
    if (read().completed) throw new Error("This exercise is already complete.");
    const value = values && typeof values === "object" ? {
      wholeNumberEnabled: values.wholeNumberEnabled === true,
      wholeNumber: String(values.wholeNumber ?? ""),
      numerator: String(values.numerator ?? ""),
      denominator: String(values.denominator ?? ""),
      simplified: values.simplified === true,
      simplifiedNumerator: String(values.simplifiedNumerator ?? ""),
      simplifiedDenominator: String(values.simplifiedDenominator ?? "")
    } : null;
    const fields = value ? [value.numerator, value.denominator, ...(value.wholeNumberEnabled ? [value.wholeNumber] : []), ...(value.simplified ? [value.simplifiedNumerator, value.simplifiedDenominator] : [])] : null;
    const numbers = fields && fields.map(field => /^[0-9]+$/.test(field) ? Number(field) : NaN);
    let classification = "invalid_input";

    if (numbers && numbers.every(number => Number.isSafeInteger(number) && number >= 0)) {
      let index = 0;
      const numerator = numbers[index++];
      const denominator = numbers[index++];
      const whole = value.wholeNumberEnabled ? numbers[index++] : 0;
      if (denominator > 0 && (!value.wholeNumberEnabled || numerator < denominator)) {
        const expectedNumerator = currentTask.addend * currentTask.denominator +
          currentTask.wholeNumber * currentTask.denominator + currentTask.numerator;
        const enteredNumerator = whole * denominator + numerator;
        const mathematicallyCorrect = enteredNumerator * currentTask.denominator === expectedNumerator * denominator;
        classification = mathematicallyCorrect ? "valid" : "incorrect_answer";

        if (mathematicallyCorrect) {
          const needsSimplification = gcd(numerator, denominator) > 1;
          if (needsSimplification && !value.simplified) {
            classification = "requires_simplification";
          } else if (value.simplified) {
            const reducedNumerator = numbers[index++];
            const reducedDenominator = numbers[index++];
            const equivalent = reducedDenominator > 0 &&
              reducedNumerator * denominator === numerator * reducedDenominator;
            const reduced = reducedNumerator > 0 && reducedDenominator > 0 &&
              gcd(reducedNumerator, reducedDenominator) === 1 &&
              (!value.wholeNumberEnabled || reducedNumerator < reducedDenominator);
            classification = equivalent && reduced ? "valid" : "not_simplified";
          }
        }
      } else classification = "incorrect_answer";
    }

    const state = read();
    state.responses.push({ classification, values: value || {} });
    if (classification === "valid") state.completed = true;
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, progress: getProgress(), completion: getCompletion() });
  }

  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentTask, getProgress, getCompletion, recordResponse, reset });
}

export { createWholeNumberMixedFractionAdditionSession };
