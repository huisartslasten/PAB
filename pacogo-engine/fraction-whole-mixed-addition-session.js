const FRACTION_WHOLE_MIXED_ADDITION_EXERCISE = Object.freeze({
  id: "fraction-whole-mixed-addition-level-1",
  title: "Heel getal optellen bij een breukgetal groter dan 1",
  difficultyLevel: 1,
  maxDifficultyLevel: 5,
  questionCount: 15,
  tasks: Object.freeze([
    { id: "FWA1-01", whole: 2, mixed: { whole: 1, numerator: 1, denominator: 2 }, answer: { whole: 3, numerator: 1, denominator: 2 } },
    { id: "FWA1-02", whole: 4, mixed: { whole: 2, numerator: 1, denominator: 3 }, answer: { whole: 6, numerator: 1, denominator: 3 } },
    { id: "FWA1-03", whole: 3, mixed: { whole: 1, numerator: 1, denominator: 4 }, answer: { whole: 4, numerator: 1, denominator: 4 } },
    { id: "FWA1-04", whole: 5, mixed: { whole: 2, numerator: 1, denominator: 5 }, answer: { whole: 7, numerator: 1, denominator: 5 } },
    { id: "FWA1-05", whole: 6, mixed: { whole: 3, numerator: 1, denominator: 2 }, answer: { whole: 9, numerator: 1, denominator: 2 } },
    { id: "FWA1-06", whole: 2, mixed: { whole: 4, numerator: 1, denominator: 3 }, answer: { whole: 6, numerator: 1, denominator: 3 } },
    { id: "FWA1-07", whole: 7, mixed: { whole: 1, numerator: 3, denominator: 4 }, answer: { whole: 8, numerator: 3, denominator: 4 } },
    { id: "FWA1-08", whole: 3, mixed: { whole: 5, numerator: 1, denominator: 5 }, answer: { whole: 8, numerator: 1, denominator: 5 } },
    { id: "FWA1-09", whole: 4, mixed: { whole: 3, numerator: 3, denominator: 8 }, answer: { whole: 7, numerator: 3, denominator: 8 } },
    { id: "FWA1-10", whole: 6, mixed: { whole: 2, numerator: 3, denominator: 10 }, answer: { whole: 8, numerator: 3, denominator: 10 } },
    { id: "FWA1-11", whole: 5, mixed: { whole: 1, numerator: 2, denominator: 3 }, answer: { whole: 6, numerator: 2, denominator: 3 } },
    { id: "FWA1-12", whole: 8, mixed: { whole: 2, numerator: 1, denominator: 4 }, answer: { whole: 10, numerator: 1, denominator: 4 } },
    { id: "FWA1-13", whole: 3, mixed: { whole: 4, numerator: 1, denominator: 5 }, answer: { whole: 7, numerator: 1, denominator: 5 } },
    { id: "FWA1-14", whole: 7, mixed: { whole: 2, numerator: 3, denominator: 4 }, answer: { whole: 9, numerator: 3, denominator: 4 } },
    { id: "FWA1-15", whole: 9, mixed: { whole: 1, numerator: 1, denominator: 2 }, answer: { whole: 10, numerator: 1, denominator: 2 } }
  ].map(task => Object.freeze({
    ...task,
    mixed: Object.freeze({ ...task.mixed }),
    answer: Object.freeze({ ...task.answer })
  })))
});

const RESPONSE_CLASSIFICATIONS = Object.freeze([
  "valid", "invalid_input", "incorrect_answer", "requires_mixed_number",
  "requires_simplification", "not_simplified"
]);

function greatestCommonDivisor(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function createFractionWholeMixedAdditionSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }

  const exercise = FRACTION_WHOLE_MIXED_ADDITION_EXERCISE;
  const taskById = new Map(exercise.tasks.map(task => [task.id, task]));
  const storageKey = "pacogo:fraction-whole-mixed-addition:v1:" + encodeURIComponent(learner);
  const emptyState = () => ({ schemaVersion: 1, completedTaskIds: [], responsesByTask: {} });

  function readState() {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyState();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error("Saved whole-number and mixed-fraction addition progress is unreadable."); }
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.completedTaskIds) ||
        !parsed.responsesByTask || typeof parsed.responsesByTask !== "object") {
      throw new Error("Saved whole-number and mixed-fraction addition progress has an unsupported format.");
    }
    const completedTaskIds = parsed.completedTaskIds.filter(id => taskById.has(id));
    const responsesByTask = {};
    for (const [taskId, responses] of Object.entries(parsed.responsesByTask)) {
      if (!taskById.has(taskId) || !Array.isArray(responses)) continue;
      if (responses.some(response => !response || !RESPONSE_CLASSIFICATIONS.includes(response.classification) ||
          !response.values || typeof response.values !== "object")) {
        throw new Error("Saved whole-number and mixed-fraction addition progress contains an invalid response.");
      }
      responsesByTask[taskId] = responses.map(response => ({
        classification: response.classification,
        values: { ...response.values }
      }));
    }
    return { schemaVersion: 1, completedTaskIds, responsesByTask };
  }

  function getCurrentTask() {
    const state = readState();
    const task = exercise.tasks.find(item => !state.completedTaskIds.includes(item.id));
    if (!task) return null;
    const index = exercise.tasks.findIndex(item => item.id === task.id);
    return Object.freeze({
      id: task.id,
      index: index + 1,
      total: exercise.questionCount,
      difficultyLevel: exercise.difficultyLevel,
      maxDifficultyLevel: exercise.maxDifficultyLevel,
      whole: task.whole,
      mixed: task.mixed
    });
  }

  function getProgress() {
    const state = readState();
    const completedCount = state.completedTaskIds.length;
    const attemptCount = Object.values(state.responsesByTask).reduce((sum, responses) => sum + responses.length, 0);
    return Object.freeze({
      completedCount,
      totalCount: exercise.questionCount,
      attemptCount,
      isComplete: completedCount === exercise.questionCount
    });
  }

  function getCurrentResponses() {
    const task = getCurrentTask();
    if (!task) return Object.freeze([]);
    const state = readState();
    return Object.freeze([...(state.responsesByTask[task.id] || [])].map(response =>
      Object.freeze({ classification: response.classification, values: Object.freeze({ ...response.values }) })
    ));
  }

  function recordAnswer({ values } = {}) {
    const current = getCurrentTask();
    if (!current) throw new Error("The fraction addition exercise is already complete.");
    const task = taskById.get(current.id);
    const normalized = values && typeof values === "object" ? {
      wholeNumberEnabled: values.wholeNumberEnabled === true,
      wholeNumber: String(values.wholeNumber ?? ""),
      numerator: String(values.numerator ?? ""),
      denominator: String(values.denominator ?? ""),
      simplified: values.simplified === true,
      simplifiedNumerator: String(values.simplifiedNumerator ?? ""),
      simplifiedDenominator: String(values.simplifiedDenominator ?? "")
    } : null;

    const enteredFields = normalized ? [
      normalized.wholeNumber, normalized.numerator, normalized.denominator,
      ...(normalized.simplified ? [normalized.simplifiedNumerator, normalized.simplifiedDenominator] : [])
    ] : [];
    const numbers = enteredFields.map(value => /^[0-9]+$/.test(value) ? Number(value) : NaN);
    let classification = "invalid_input";

    if (normalized && normalized.wholeNumberEnabled && numbers.every(Number.isSafeInteger)) {
      const [whole, numerator, denominator] = numbers;
      if (denominator > 0 && numerator < denominator) {
        const expected = task.answer;
        const equivalent = whole * denominator * expected.denominator +
          numerator * expected.denominator ===
          expected.whole * denominator * expected.denominator +
          expected.numerator * denominator;
        classification = equivalent ? "valid" : "incorrect_answer";
        if (equivalent) {
          if (greatestCommonDivisor(numerator, denominator) !== 1) {
            if (!normalized.simplified) classification = "requires_simplification";
            else {
              const reducedNumerator = numbers[3];
              const reducedDenominator = numbers[4];
              const validReduced = Number.isSafeInteger(reducedNumerator) &&
                Number.isSafeInteger(reducedDenominator) && reducedNumerator > 0 &&
                reducedDenominator > 0 && reducedNumerator < reducedDenominator &&
                greatestCommonDivisor(reducedNumerator, reducedDenominator) === 1 &&
                reducedNumerator * denominator === numerator * reducedDenominator &&
                whole === expected.whole &&
                reducedNumerator * expected.denominator === expected.numerator * reducedDenominator;
              classification = validReduced ? "valid" : "not_simplified";
            }
          } else if (normalized.simplified) {
            const reducedNumerator = numbers[3];
            const reducedDenominator = numbers[4];
            const validReduced = Number.isSafeInteger(reducedNumerator) &&
              Number.isSafeInteger(reducedDenominator) && reducedNumerator > 0 &&
              reducedDenominator > 0 && reducedNumerator < reducedDenominator &&
              greatestCommonDivisor(reducedNumerator, reducedDenominator) === 1 &&
              reducedNumerator * denominator === numerator * reducedDenominator;
            classification = validReduced ? "valid" : "not_simplified";
          }
        }
      } else classification = "incorrect_answer";
    } else if (normalized && !normalized.wholeNumberEnabled) {
      classification = "requires_mixed_number";
    }

    const state = readState();
    const responses = state.responsesByTask[current.id] || [];
    responses.push({ classification, values: normalized || {} });
    state.responsesByTask[current.id] = responses;
    if (classification === "valid" && !state.completedTaskIds.includes(current.id)) {
      state.completedTaskIds.push(current.id);
    }
    storage.setItem(storageKey, JSON.stringify(state));
    return Object.freeze({
      classification,
      progress: getProgress(),
      currentTask: getCurrentTask()
    });
  }

  function reset() { storage.removeItem(storageKey); }
  return Object.freeze({ getCurrentTask, getProgress, getCurrentResponses, recordAnswer, reset });
}

export { FRACTION_WHOLE_MIXED_ADDITION_EXERCISE, createFractionWholeMixedAdditionSession };
