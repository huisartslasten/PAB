const FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE = Object.freeze({
  id: "fraction-mixed-same-denominator-addition-level-2",
  title: "Gelijknamige breuken groter dan 1 bij elkaar optellen",
  difficultyLevel: 2,
  maxDifficultyLevel: 5,
  questionCount: 15,
  tasks: Object.freeze([
    { id: "FMSD2-01", left: { wholeNumber: 2, numerator: 3, denominator: 8 }, right: { wholeNumber: 1, numerator: 6, denominator: 8 } },
    { id: "FMSD2-02", left: { wholeNumber: 4, numerator: 5, denominator: 12 }, right: { wholeNumber: 2, numerator: 8, denominator: 12 } },
    { id: "FMSD2-03", left: { wholeNumber: 3, numerator: 4, denominator: 7 }, right: { wholeNumber: 5, numerator: 6, denominator: 7 } },
    { id: "FMSD2-04", left: { wholeNumber: 6, numerator: 2, denominator: 9 }, right: { wholeNumber: 1, numerator: 8, denominator: 9 } },
    { id: "FMSD2-05", left: { wholeNumber: 2, numerator: 5, denominator: 6 }, right: { wholeNumber: 3, numerator: 4, denominator: 6 } },
    { id: "FMSD2-06", left: { wholeNumber: 7, numerator: 3, denominator: 10 }, right: { wholeNumber: 2, numerator: 9, denominator: 10 } },
    { id: "FMSD2-07", left: { wholeNumber: 4, numerator: 7, denominator: 8 }, right: { wholeNumber: 3, numerator: 5, denominator: 8 } },
    { id: "FMSD2-08", left: { wholeNumber: 5, numerator: 4, denominator: 11 }, right: { wholeNumber: 2, numerator: 9, denominator: 11 } },
    { id: "FMSD2-09", left: { wholeNumber: 1, numerator: 5, denominator: 9 }, right: { wholeNumber: 6, numerator: 7, denominator: 9 } },
    { id: "FMSD2-10", left: { wholeNumber: 8, numerator: 6, denominator: 13 }, right: { wholeNumber: 1, numerator: 9, denominator: 13 } },
    { id: "FMSD2-11", left: { wholeNumber: 4, numerator: 6, denominator: 12 }, right: { wholeNumber: 3, numerator: 8, denominator: 12 } },
    { id: "FMSD2-12", left: { wholeNumber: 6, numerator: 3, denominator: 7 }, right: { wholeNumber: 2, numerator: 6, denominator: 7 } },
    { id: "FMSD2-13", left: { wholeNumber: 9, numerator: 5, denominator: 8 }, right: { wholeNumber: 2, numerator: 7, denominator: 8 } },
    { id: "FMSD2-14", left: { wholeNumber: 5, numerator: 2, denominator: 5 }, right: { wholeNumber: 3, numerator: 4, denominator: 5 } },
    { id: "FMSD2-15", left: { wholeNumber: 7, numerator: 7, denominator: 12 }, right: { wholeNumber: 4, numerator: 8, denominator: 12 } }
  ].map(task => Object.freeze({
    ...task,
    left: Object.freeze({ ...task.left }),
    right: Object.freeze({ ...task.right })
  })))
});

const CLASSIFICATIONS = Object.freeze([
  "valid", "invalid_input", "incorrect_answer", "requires_simplification", "not_simplified"
]);

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) [left, right] = [right, left % right];
  return left;
}

function expectedFor(task) {
  const denominator = task.left.denominator;
  const numerator = task.left.numerator + task.right.numerator;
  const whole = task.left.wholeNumber + task.right.wholeNumber + Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  const divisor = gcd(remainder, denominator);
  return Object.freeze({
    whole,
    numerator: remainder,
    denominator,
    reducedNumerator: remainder / divisor,
    reducedDenominator: denominator / divisor,
    requiresSimplification: remainder > 0 && divisor > 1
  });
}

function createFractionMixedSameDenominatorAdditionSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }

  const exercise = FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE;
  const taskById = new Map(exercise.tasks.map(task => [task.id, task]));
  const storageKey = "pacogo:fraction-mixed-same-denominator-addition:v1:" + encodeURIComponent(learner);
  const emptyState = () => ({ schemaVersion: 1, completedTaskIds: [], responsesByTask: {} });

  function readState() {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyState();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error("Saved mixed same-denominator addition progress is unreadable."); }
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.completedTaskIds) ||
        !parsed.responsesByTask || typeof parsed.responsesByTask !== "object") {
      throw new Error("Saved mixed same-denominator addition progress has an unsupported format.");
    }
    const completedTaskIds = parsed.completedTaskIds.filter(id => taskById.has(id));
    const responsesByTask = {};
    for (const [id, responses] of Object.entries(parsed.responsesByTask)) {
      if (!taskById.has(id) || !Array.isArray(responses)) continue;
      if (responses.some(item => !item || !CLASSIFICATIONS.includes(item.classification) ||
          !item.values || typeof item.values !== "object")) {
        throw new Error("Saved mixed same-denominator addition progress contains an invalid response.");
      }
      responsesByTask[id] = responses.map(item => ({
        classification: item.classification, values: { ...item.values }
      }));
    }
    return { schemaVersion: 1, completedTaskIds, responsesByTask };
  }

  function getCurrentTask() {
    const state = readState();
    const index = exercise.tasks.findIndex(task => !state.completedTaskIds.includes(task.id));
    if (index < 0) return null;
    const task = exercise.tasks[index];
    return Object.freeze({
      id: task.id, index: index + 1, total: exercise.questionCount,
      difficultyLevel: exercise.difficultyLevel, maxDifficultyLevel: exercise.maxDifficultyLevel,
      left: task.left, right: task.right
    });
  }

  function getProgress() {
    const state = readState();
    return Object.freeze({
      completedCount: state.completedTaskIds.length,
      totalCount: exercise.questionCount,
      attemptCount: Object.values(state.responsesByTask).reduce((sum, items) => sum + items.length, 0),
      isComplete: state.completedTaskIds.length === exercise.questionCount
    });
  }

  function recordAnswer({ values } = {}) {
    const current = getCurrentTask();
    if (!current) throw new Error("The mixed same-denominator addition exercise is already complete.");
    const expected = expectedFor(taskById.get(current.id));
    const v = values && typeof values === "object" ? {
      wholeNumberEnabled: values.wholeNumberEnabled === true,
      wholeNumber: String(values.wholeNumber ?? ""),
      numerator: String(values.numerator ?? ""),
      denominator: String(values.denominator ?? ""),
      simplified: values.simplified === true,
      simplifiedNumerator: String(values.simplifiedNumerator ?? ""),
      simplifiedDenominator: String(values.simplifiedDenominator ?? "")
    } : null;
    let classification = "invalid_input";

    if (v) {
      const [num, den] = [v.numerator, v.denominator].map(value =>
        /^[0-9]+$/.test(value) ? Number(value) : NaN
      );
      const whole = v.wholeNumberEnabled && /^[0-9]+$/.test(v.wholeNumber) ? Number(v.wholeNumber) : NaN;
      if (Number.isSafeInteger(num) && Number.isSafeInteger(den) && den > 0 && num > 0 && num < den &&
          v.wholeNumberEnabled && Number.isSafeInteger(whole) && whole >= 0) {
        const equivalent = (whole * den + num) * expected.denominator ===
          (expected.whole * expected.denominator + expected.numerator) * den;
        classification = equivalent ? "valid" : "incorrect_answer";
        if (equivalent && expected.requiresSimplification) {
          if (gcd(num, den) === 1) {
            classification = "valid";
          } else if (!v.simplified) {
            classification = "requires_simplification";
          } else {
            const reducedNum = /^[0-9]+$/.test(v.simplifiedNumerator) ? Number(v.simplifiedNumerator) : NaN;
            const reducedDen = /^[0-9]+$/.test(v.simplifiedDenominator) ? Number(v.simplifiedDenominator) : NaN;
            const validReduced = Number.isSafeInteger(reducedNum) && Number.isSafeInteger(reducedDen) &&
              reducedNum > 0 && reducedDen > 0 && reducedNum < reducedDen &&
              gcd(reducedNum, reducedDen) === 1 &&
              reducedNum * den === num * reducedDen &&
              reducedNum === expected.reducedNumerator &&
              reducedDen === expected.reducedDenominator;
            classification = validReduced ? "valid" : "not_simplified";
          }
        } else if (equivalent && v.simplified) {
          const reducedNum = /^[0-9]+$/.test(v.simplifiedNumerator) ? Number(v.simplifiedNumerator) : NaN;
          const reducedDen = /^[0-9]+$/.test(v.simplifiedDenominator) ? Number(v.simplifiedDenominator) : NaN;
          const validReduced = Number.isSafeInteger(reducedNum) && Number.isSafeInteger(reducedDen) &&
            reducedNum > 0 && reducedDen > 0 && reducedNum < reducedDen &&
            gcd(reducedNum, reducedDen) === 1 &&
            reducedNum * den === num * reducedDen;
          classification = validReduced ? "valid" : "not_simplified";
        }
      }
    }

    const state = readState();
    const responses = state.responsesByTask[current.id] || [];
    responses.push({ classification, values: v || {} });
    state.responsesByTask[current.id] = responses;
    if (classification === "valid" && !state.completedTaskIds.includes(current.id)) {
      state.completedTaskIds.push(current.id);
    }
    storage.setItem(storageKey, JSON.stringify(state));
    return Object.freeze({ classification, progress: getProgress(), currentTask: getCurrentTask() });
  }

  function getCurrentResponses() {
    const task = getCurrentTask();
    if (!task) return Object.freeze([]);
    const state = readState();
    return Object.freeze([...(state.responsesByTask[task.id] || [])].map(item =>
      Object.freeze({ classification: item.classification, values: Object.freeze({ ...item.values }) })
    ));
  }

  function reset() { storage.removeItem(storageKey); }
  return Object.freeze({ getCurrentTask, getProgress, getCurrentResponses, recordAnswer, reset });
}

export {
  FRACTION_MIXED_SAME_DENOMINATOR_ADDITION_EXERCISE,
  createFractionMixedSameDenominatorAdditionSession,
  expectedFor
};
