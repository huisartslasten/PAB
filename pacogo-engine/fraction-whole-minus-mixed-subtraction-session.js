const FRACTION_SUBTRACTION_EXERCISE = Object.freeze({
  id: "fraction-whole-minus-mixed-level-1",
  title: "Breukgetal groter dan 1 aftrekken van een heel getal",
  difficultyLevel: 1,
  maxDifficultyLevel: 5,
  questionCount: 4,
  tasks: Object.freeze([
    { id: "FWS1-01", whole: 8, mixed: { whole: 2, numerator: 5, denominator: 7 }, answer: { whole: 5, numerator: 2, denominator: 7 }, source: "user-screenshot" },
    { id: "FWS1-02", whole: 6, mixed: { whole: 5, numerator: 4, denominator: 9 }, answer: { whole: 0, numerator: 5, denominator: 9 }, source: "user-screenshot" },
    { id: "FWS1-03", whole: 6, mixed: { whole: 3, numerator: 3, denominator: 7 }, answer: { whole: 2, numerator: 4, denominator: 7 }, source: "user-screenshot" },
    { id: "FWS1-04", whole: 9, mixed: { whole: 8, numerator: 6, denominator: 7 }, answer: { whole: 0, numerator: 1, denominator: 7 }, source: "user-screenshot" }
  ].map(task => Object.freeze({
    ...task,
    mixed: Object.freeze({ ...task.mixed }),
    answer: Object.freeze({ ...task.answer })
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

function createFractionSubtractionPracticeSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  const exercise = FRACTION_SUBTRACTION_EXERCISE;
  const taskById = new Map(exercise.tasks.map(task => [task.id, task]));
  const storageKey = "pacogo:fraction-subtraction-practice:v2:" + encodeURIComponent(learner);
  const emptyState = () => ({ schemaVersion: 2, completedTaskIds: [], responsesByTask: {} });

  function readState() {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyState();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error("Saved fraction subtraction progress is unreadable."); }
    if (!parsed || parsed.schemaVersion !== 2 || !Array.isArray(parsed.completedTaskIds) ||
        !parsed.responsesByTask || typeof parsed.responsesByTask !== "object") {
      throw new Error("Saved fraction subtraction progress has an unsupported format.");
    }
    const completedTaskIds = parsed.completedTaskIds.filter(id => taskById.has(id));
    const responsesByTask = {};
    for (const [id, responses] of Object.entries(parsed.responsesByTask)) {
      if (!taskById.has(id) || !Array.isArray(responses)) continue;
      if (responses.some(item => !item || !CLASSIFICATIONS.includes(item.classification) ||
          !item.values || typeof item.values !== "object")) {
        throw new Error("Saved fraction subtraction progress contains an invalid response.");
      }
      responsesByTask[id] = responses.map(item => ({
        classification: item.classification,
        values: Object.fromEntries(["wholeNumberEnabled","wholeNumber","numerator","denominator","simplified","simplifiedNumerator","simplifiedDenominator"]
          .map(key => [key, item.values[key]]))
      }));
    }
    return { schemaVersion: 2, completedTaskIds, responsesByTask };
  }

  function getCurrentTask() {
    const state = readState();
    const index = exercise.tasks.findIndex(task => !state.completedTaskIds.includes(task.id));
    if (index < 0) return null;
    const task = exercise.tasks[index];
    return Object.freeze({
      id: task.id, index: index + 1, total: exercise.questionCount,
      difficultyLevel: exercise.difficultyLevel, maxDifficultyLevel: exercise.maxDifficultyLevel,
      whole: task.whole, mixed: task.mixed
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
    if (!current) throw new Error("The fraction subtraction exercise is already complete.");
    const task = taskById.get(current.id);
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
      const numerator = /^[0-9]+$/.test(v.numerator) ? Number(v.numerator) : NaN;
      const denominator = /^[0-9]+$/.test(v.denominator) ? Number(v.denominator) : NaN;
      const whole = v.wholeNumberEnabled && /^[0-9]+$/.test(v.wholeNumber) ? Number(v.wholeNumber) : NaN;
      const expected = task.answer;
      const wholeShapeValid = expected.whole === 0
        ? !v.wholeNumberEnabled
        : v.wholeNumberEnabled && Number.isSafeInteger(whole);
      if (Number.isSafeInteger(numerator) && Number.isSafeInteger(denominator) &&
          denominator > 0 && numerator > 0 && numerator < denominator && wholeShapeValid) {
        const enteredWhole = v.wholeNumberEnabled ? whole : 0;
        const equivalent = (enteredWhole * denominator + numerator) * expected.denominator ===
          (expected.whole * expected.denominator + expected.numerator) * denominator;
        classification = equivalent ? "valid" : "incorrect_answer";
        if (equivalent && gcd(numerator, denominator) > 1) {
          if (!v.simplified) classification = "requires_simplification";
          else {
            const reducedNumerator = /^[0-9]+$/.test(v.simplifiedNumerator) ? Number(v.simplifiedNumerator) : NaN;
            const reducedDenominator = /^[0-9]+$/.test(v.simplifiedDenominator) ? Number(v.simplifiedDenominator) : NaN;
            const validReduced = Number.isSafeInteger(reducedNumerator) && Number.isSafeInteger(reducedDenominator) &&
              reducedNumerator > 0 && reducedDenominator > 0 && reducedNumerator < reducedDenominator &&
              gcd(reducedNumerator, reducedDenominator) === 1 &&
              reducedNumerator * denominator === numerator * reducedDenominator &&
              reducedNumerator === expected.numerator && reducedDenominator === expected.denominator;
            classification = validReduced ? "valid" : "not_simplified";
          }
        } else if (equivalent && v.simplified) {
          const reducedNumerator = /^[0-9]+$/.test(v.simplifiedNumerator) ? Number(v.simplifiedNumerator) : NaN;
          const reducedDenominator = /^[0-9]+$/.test(v.simplifiedDenominator) ? Number(v.simplifiedDenominator) : NaN;
          const validReduced = Number.isSafeInteger(reducedNumerator) && Number.isSafeInteger(reducedDenominator) &&
            reducedNumerator > 0 && reducedDenominator > 0 && reducedNumerator < reducedDenominator &&
            gcd(reducedNumerator, reducedDenominator) === 1 &&
            reducedNumerator * denominator === numerator * reducedDenominator;
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

  function reset() { storage.removeItem(storageKey); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}

export { FRACTION_SUBTRACTION_EXERCISE, createFractionSubtractionPracticeSession };
