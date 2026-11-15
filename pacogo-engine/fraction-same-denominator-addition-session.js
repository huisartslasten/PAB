const FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE = Object.freeze({
  id: "fraction-same-denominator-addition-level-1",
  title: "Gelijknamige breuken kleiner dan 1 bij elkaar optellen",
  difficultyLevel: 1,
  maxDifficultyLevel: 5,
  questionCount: 15,
  tasks: Object.freeze([
    { id: "FSD1-01", left: { numerator: 3, denominator: 10 }, right: { numerator: 1, denominator: 10 }, source: "user-screenshot" },
    { id: "FSD1-02", left: { numerator: 5, denominator: 10 }, right: { numerator: 4, denominator: 10 }, source: "user-screenshot" },
    { id: "FSD1-03", left: { numerator: 9, denominator: 10 }, right: { numerator: 2, denominator: 10 }, source: "user-screenshot" },
    { id: "FSD1-04", left: { numerator: 6, denominator: 7 }, right: { numerator: 5, denominator: 7 }, source: "user-screenshot" },
    { id: "FSD1-05", left: { numerator: 9, denominator: 10 }, right: { numerator: 9, denominator: 10 }, source: "user-screenshot" },
    { id: "FSD1-06", left: { numerator: 2, denominator: 8 }, right: { numerator: 3, denominator: 8 }, source: "authored-variation" },
    { id: "FSD1-07", left: { numerator: 4, denominator: 9 }, right: { numerator: 2, denominator: 9 }, source: "authored-variation" },
    { id: "FSD1-08", left: { numerator: 3, denominator: 8 }, right: { numerator: 4, denominator: 8 }, source: "authored-variation" },
    { id: "FSD1-09", left: { numerator: 2, denominator: 6 }, right: { numerator: 1, denominator: 6 }, source: "authored-variation" },
    { id: "FSD1-10", left: { numerator: 5, denominator: 12 }, right: { numerator: 4, denominator: 12 }, source: "authored-variation" },
    { id: "FSD1-11", left: { numerator: 7, denominator: 10 }, right: { numerator: 4, denominator: 10 }, source: "authored-variation" },
    { id: "FSD1-12", left: { numerator: 3, denominator: 7 }, right: { numerator: 2, denominator: 7 }, source: "authored-variation" },
    { id: "FSD1-13", left: { numerator: 5, denominator: 8 }, right: { numerator: 4, denominator: 8 }, source: "authored-variation" },
    { id: "FSD1-14", left: { numerator: 8, denominator: 12 }, right: { numerator: 5, denominator: 12 }, source: "authored-variation" },
    { id: "FSD1-15", left: { numerator: 7, denominator: 9 }, right: { numerator: 5, denominator: 9 }, source: "authored-variation" }
  ].map(task => Object.freeze({
    ...task, left: Object.freeze({ ...task.left }), right: Object.freeze({ ...task.right })
  })))
});

const CLASSIFICATIONS = Object.freeze([
  "valid", "invalid_input", "incorrect_answer", "requires_mixed_number",
  "requires_simplification", "not_simplified"
]);

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function expectedFor(task) {
  const numerator = task.left.numerator + task.right.numerator;
  const denominator = task.left.denominator;
  const whole = Math.floor(numerator / denominator);
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

function createFractionSameDenominatorAdditionSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  const exercise = FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE;
  const taskById = new Map(exercise.tasks.map(task => [task.id, task]));
  const storageKey = "pacogo:fraction-same-denominator-addition:v1:" + encodeURIComponent(learner);
  const emptyState = () => ({ schemaVersion: 1, completedTaskIds: [], responsesByTask: {} });

  function readState() {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyState();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error("Saved same-denominator addition progress is unreadable."); }
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.completedTaskIds) ||
        !parsed.responsesByTask || typeof parsed.responsesByTask !== "object") {
      throw new Error("Saved same-denominator addition progress has an unsupported format.");
    }
    const completedTaskIds = parsed.completedTaskIds.filter(id => taskById.has(id));
    const responsesByTask = {};
    for (const [id, responses] of Object.entries(parsed.responsesByTask)) {
      if (!taskById.has(id) || !Array.isArray(responses)) continue;
      if (responses.some(item => !item || !CLASSIFICATIONS.includes(item.classification) ||
          !item.values || typeof item.values !== "object")) {
        throw new Error("Saved same-denominator addition progress contains an invalid response.");
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
    if (!current) throw new Error("The same-denominator addition exercise is already complete.");
    const task = taskById.get(current.id);
    const expected = expectedFor(task);
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
      const base = [v.numerator, v.denominator];
      const extra = v.simplified ? [v.simplifiedNumerator, v.simplifiedDenominator] : [];
      const rawNumbers = [...base, ...extra].map(x => /^[0-9]+$/.test(x) ? Number(x) : NaN);
      const [num, den, reducedNum, reducedDen] = rawNumbers;
      const wholeValue = v.wholeNumberEnabled && /^[0-9]+$/.test(v.wholeNumber) ? Number(v.wholeNumber) : NaN;
      const wholeShapeValid = expected.whole === 0
        ? !v.wholeNumberEnabled
        : v.wholeNumberEnabled && wholeValue === expected.whole;
      if (rawNumbers.every(Number.isSafeInteger) && den > 0 && num > 0 && num < den &&
          wholeShapeValid && (!v.wholeNumberEnabled || Number.isSafeInteger(wholeValue))) {
        const equivalent = (expected.whole * den + expected.numerator) * expected.denominator ===
          (wholeValue * den + num) * expected.denominator;
        classification = equivalent ? "valid" : "incorrect_answer";
        if (equivalent && expected.requiresSimplification) {
          if (!v.simplified) classification = "requires_simplification";
          else {
            const validReduced = Number.isSafeInteger(reducedNum) && Number.isSafeInteger(reducedDen) &&
              reducedNum > 0 && reducedDen > 0 && reducedNum < reducedDen &&
              gcd(reducedNum, reducedDen) === 1 &&
              reducedNum * den === num * reducedDen &&
              reducedNum === expected.reducedNumerator &&
              reducedDen === expected.reducedDenominator;
            classification = validReduced ? "valid" : "not_simplified";
          }
        } else if (equivalent && v.simplified) {
          const validReduced = Number.isSafeInteger(reducedNum) && Number.isSafeInteger(reducedDen) &&
            reducedNum > 0 && reducedDen > 0 && reducedNum < reducedDen &&
            gcd(reducedNum, reducedDen) === 1 &&
            reducedNum * den === num * reducedDen;
          classification = validReduced ? "valid" : "not_simplified";
        }
      } else if (expected.whole > 0 && !v.wholeNumberEnabled) {
        classification = "requires_mixed_number";
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

export { FRACTION_SAME_DENOMINATOR_ADDITION_EXERCISE, createFractionSameDenominatorAdditionSession, expectedFor };
