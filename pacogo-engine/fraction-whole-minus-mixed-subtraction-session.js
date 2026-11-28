import { createPracticeSessionCore } from "./practice-session-core.js";

const FRACTION_SUBTRACTION_EXERCISE = Object.freeze({
  id: "fraction-whole-minus-mixed-level-1",
  title: "Breukgetal groter dan 1 aftrekken van een heel getal",
  difficultyLevel: 1,
  maxDifficultyLevel: 5,
  questionCount: 15,
  tasks: Object.freeze([
    { id: "FWS1-01", whole: 7, mixed: { whole: 2, numerator: 3, denominator: 5 }, answer: { whole: 4, numerator: 2, denominator: 5 } },
    { id: "FWS1-02", whole: 9, mixed: { whole: 4, numerator: 2, denominator: 7 }, answer: { whole: 4, numerator: 5, denominator: 7 } },
    { id: "FWS1-03", whole: 6, mixed: { whole: 3, numerator: 1, denominator: 4 }, answer: { whole: 2, numerator: 3, denominator: 4 } },
    { id: "FWS1-04", whole: 8, mixed: { whole: 5, numerator: 3, denominator: 8 }, answer: { whole: 2, numerator: 5, denominator: 8 } },
    { id: "FWS1-05", whole: 10, mixed: { whole: 6, numerator: 4, denominator: 9 }, answer: { whole: 3, numerator: 5, denominator: 9 } },
    { id: "FWS1-06", whole: 5, mixed: { whole: 2, numerator: 5, denominator: 6 }, answer: { whole: 2, numerator: 1, denominator: 6 } },
    { id: "FWS1-07", whole: 12, mixed: { whole: 7, numerator: 3, denominator: 10 }, answer: { whole: 4, numerator: 7, denominator: 10 } },
    { id: "FWS1-08", whole: 9, mixed: { whole: 3, numerator: 5, denominator: 8 }, answer: { whole: 5, numerator: 3, denominator: 8 } },
    { id: "FWS1-09", whole: 7, mixed: { whole: 5, numerator: 2, denominator: 3 }, answer: { whole: 1, numerator: 1, denominator: 3 } },
    { id: "FWS1-10", whole: 11, mixed: { whole: 6, numerator: 5, denominator: 12 }, answer: { whole: 4, numerator: 7, denominator: 12 } },
    { id: "FWS1-11", whole: 8, mixed: { whole: 4, numerator: 7, denominator: 10 }, answer: { whole: 3, numerator: 3, denominator: 10 } },
    { id: "FWS1-12", whole: 13, mixed: { whole: 9, numerator: 4, denominator: 11 }, answer: { whole: 3, numerator: 7, denominator: 11 } },
    { id: "FWS1-13", whole: 6, mixed: { whole: 4, numerator: 5, denominator: 9 }, answer: { whole: 1, numerator: 4, denominator: 9 } },
    { id: "FWS1-14", whole: 10, mixed: { whole: 8, numerator: 7, denominator: 12 }, answer: { whole: 1, numerator: 5, denominator: 12 } },
    { id: "FWS1-15", whole: 14, mixed: { whole: 9, numerator: 5, denominator: 8 }, answer: { whole: 4, numerator: 3, denominator: 8 } }
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

  const core = createPracticeSessionCore({
    tasks: exercise.tasks,
    initialState: readState(),
    completionMode: "automatic",
    onStateChange: state => storage.setItem(storageKey, JSON.stringify({ schemaVersion: 2, ...state }))
  });


  function getCurrentTask() {
    const task = core.getCurrentTask();
    if (!task) return null;
    return Object.freeze({
      id: task.id,
      index: exercise.tasks.findIndex(item => item.id === task.id) + 1,
      total: exercise.questionCount,
      difficultyLevel: exercise.difficultyLevel,
      maxDifficultyLevel: exercise.maxDifficultyLevel,
      whole: task.whole,
      mixed: task.mixed
    });
  }

  function getProgress() {
    const progress = core.getProgress();
    return Object.freeze({
      completedCount: progress.completedCount,
      totalCount: exercise.questionCount,
      attemptCount: progress.attemptCount,
      isComplete: progress.isComplete
    });
  }

  function recordAnswer({ values } = {}) {
    const current = getCurrentTask();
    if (!current) throw new Error("The fraction subtraction exercise is already complete.");
    const task = exercise.tasks.find(item => item.id === current.id);
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
    core.recordAttempt({
      taskId: current.id,
      classification,
      response: { values: v || {} }
    });
    return Object.freeze({ classification, progress: getProgress(), currentTask: getCurrentTask() });
  }

  function reset() { core.reset(); storage.removeItem(storageKey); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}

export { FRACTION_SUBTRACTION_EXERCISE, createFractionSubtractionPracticeSession };
