const FRACTION_PRACTICE_TASKS = Object.freeze([
  Object.freeze({
    id: "FR2-PRACTICE-01",
    targetFraction: Object.freeze({ numerator: 1, denominator: 2 }),
    options: Object.freeze([
      Object.freeze({ id: "two-fourths", fraction: Object.freeze({ numerator: 2, denominator: 4 }) }),
      Object.freeze({ id: "three-fourths", fraction: Object.freeze({ numerator: 3, denominator: 4 }) })
    ]),
    optionRepresentation: "symbolic_fraction",
    targetLayout: "bar"
  }),
  Object.freeze({
    id: "FR2-PRACTICE-02",
    targetFraction: Object.freeze({ numerator: 1, denominator: 3 }),
    options: Object.freeze([
      Object.freeze({ id: "two-sixths", fraction: Object.freeze({ numerator: 2, denominator: 6 }) }),
      Object.freeze({ id: "two-thirds", fraction: Object.freeze({ numerator: 2, denominator: 3 }) })
    ]),
    optionRepresentation: "symbolic_fraction",
    targetLayout: "pie"
  }),
  Object.freeze({
    id: "FR2-PRACTICE-03",
    targetFraction: Object.freeze({ numerator: 2, denominator: 3 }),
    options: Object.freeze([
      Object.freeze({ id: "four-sixths", fraction: Object.freeze({ numerator: 4, denominator: 6 }) }),
      Object.freeze({ id: "three-sixths", fraction: Object.freeze({ numerator: 3, denominator: 6 }) })
    ]),
    optionRepresentation: "area_model",
    targetLayout: "bar"
  })
]);

function createFractionPracticeSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }

  const storageKey = "pacogo:fraction-practice:v1:" + encodeURIComponent(learner);
  const taskIds = new Set(FRACTION_PRACTICE_TASKS.map(task => task.id));

  function readProgress() {
    const raw = storage.getItem(storageKey);
    if (!raw) return { schemaVersion: 1, completedTaskIds: [], attemptsByTask: {}, correctAnswers: 0 };
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Saved fraction practice progress is unreadable.");
    }
    if (!parsed || parsed.schemaVersion !== 1 ||
        !Array.isArray(parsed.completedTaskIds) ||
        !parsed.attemptsByTask || typeof parsed.attemptsByTask !== "object" ||
        !Number.isInteger(parsed.correctAnswers) || parsed.correctAnswers < 0) {
      throw new Error("Saved fraction practice progress has an unsupported format.");
    }
    return {
      schemaVersion: 1,
      completedTaskIds: parsed.completedTaskIds.filter(id => taskIds.has(id)),
      attemptsByTask: Object.fromEntries(Object.entries(parsed.attemptsByTask)
        .filter(([id, count]) => taskIds.has(id) && Number.isInteger(count) && count >= 0)),
      correctAnswers: parsed.correctAnswers
    };
  }

  function writeProgress(progress) {
    storage.setItem(storageKey, JSON.stringify(progress));
  }

  function getProgress() {
    const progress = readProgress();
    return Object.freeze({
      completedCount: progress.completedTaskIds.length,
      totalCount: FRACTION_PRACTICE_TASKS.length,
      correctAnswers: progress.correctAnswers,
      completedTaskIds: Object.freeze([...progress.completedTaskIds]),
      attemptsByTask: Object.freeze({ ...progress.attemptsByTask }),
      isComplete: progress.completedTaskIds.length === FRACTION_PRACTICE_TASKS.length
    });
  }

  function getNextTaskId() {
    const progress = readProgress();
    return FRACTION_PRACTICE_TASKS.find(task => !progress.completedTaskIds.includes(task.id))?.id || null;
  }

  function recordAnswer({ taskId, correct } = {}) {
    if (!taskIds.has(taskId)) throw new TypeError("Unknown fraction practice task.");
    if (typeof correct !== "boolean") throw new TypeError("correct must be a boolean.");
    const progress = readProgress();
    progress.attemptsByTask[taskId] = (progress.attemptsByTask[taskId] || 0) + 1;
    if (correct) progress.correctAnswers += 1;
    if (!progress.completedTaskIds.includes(taskId)) progress.completedTaskIds.push(taskId);
    writeProgress(progress);
    return getProgress();
  }

  function reset() {
    storage.removeItem(storageKey);
  }

  return Object.freeze({ getProgress, getNextTaskId, recordAnswer, reset });
}

export { FRACTION_PRACTICE_TASKS, createFractionPracticeSession };
