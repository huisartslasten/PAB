const FRACTION_CONSTRUCTION_PRACTICE_TASKS = Object.freeze([
  Object.freeze({ id: "fraction-construction-practice-01", targetFraction: Object.freeze({ numerator: 1, denominator: 2 }), answerDenominator: 4 }),
  Object.freeze({ id: "fraction-construction-practice-02", targetFraction: Object.freeze({ numerator: 1, denominator: 3 }), answerDenominator: 6 }),
  Object.freeze({ id: "fraction-construction-practice-03", targetFraction: Object.freeze({ numerator: 2, denominator: 3 }), answerDenominator: 6 })
]);

function evaluateEquivalentNumerator({ targetFraction, numerator, denominator } = {}) {
  if (!targetFraction || !Number.isSafeInteger(targetFraction.numerator) ||
      !Number.isSafeInteger(targetFraction.denominator) ||
      targetFraction.numerator <= 0 || targetFraction.denominator <= targetFraction.numerator ||
      !Number.isSafeInteger(denominator) || denominator <= 1 ||
      !Number.isSafeInteger(numerator) || numerator <= 0) return "invalid_input";
  return numerator * targetFraction.denominator === targetFraction.numerator * denominator
    ? "correct" : "not_equivalent";
}

function createFractionConstructionPracticeSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  const storageKey = "pacogo:fraction-construction-practice:v1:" + encodeURIComponent(learner);
  const taskIds = new Set(FRACTION_CONSTRUCTION_PRACTICE_TASKS.map(task => task.id));
  const emptyProgress = () => ({ schemaVersion: 1, completedTaskIds: [], responsesByTask: {} });

  function readProgress() {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyProgress();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error("Saved fraction construction practice is unreadable."); }
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.completedTaskIds) ||
        !parsed.responsesByTask || typeof parsed.responsesByTask !== "object" ||
        Array.isArray(parsed.responsesByTask)) {
      throw new Error("Saved fraction construction practice has an unsupported format.");
    }
    const responsesByTask = {};
    for (const [taskId, responses] of Object.entries(parsed.responsesByTask)) {
      if (!taskIds.has(taskId) || !Array.isArray(responses)) {
        throw new Error("Saved fraction construction practice contains an unknown task.");
      }
      responsesByTask[taskId] = responses.map(response => {
        if (!response || typeof response.rawNumerator !== "string" ||
            !["correct", "not_equivalent", "invalid_input"].includes(response.classification)) {
          throw new Error("Saved fraction construction practice contains an invalid response.");
        }
        return { rawNumerator: response.rawNumerator, classification: response.classification };
      });
    }
    return {
      schemaVersion: 1,
      completedTaskIds: [...new Set(parsed.completedTaskIds.filter(id => taskIds.has(id)))],
      responsesByTask
    };
  }

  function getProgress() {
    const progress = readProgress();
    const attemptsByTask = Object.fromEntries(FRACTION_CONSTRUCTION_PRACTICE_TASKS.map(task => [
      task.id, (progress.responsesByTask[task.id] || []).length
    ]));
    return Object.freeze({
      completedCount: progress.completedTaskIds.length,
      totalCount: FRACTION_CONSTRUCTION_PRACTICE_TASKS.length,
      completedTaskIds: Object.freeze([...progress.completedTaskIds]),
      attemptsByTask: Object.freeze(attemptsByTask),
      isComplete: progress.completedTaskIds.length === FRACTION_CONSTRUCTION_PRACTICE_TASKS.length
    });
  }

  function getNextTaskId() {
    const progress = readProgress();
    return FRACTION_CONSTRUCTION_PRACTICE_TASKS.find(task =>
      !progress.completedTaskIds.includes(task.id))?.id || null;
  }

  function recordResponse({ taskId, rawNumerator } = {}) {
    const task = FRACTION_CONSTRUCTION_PRACTICE_TASKS.find(item => item.id === taskId);
    if (!task) throw new TypeError("Unknown fraction construction practice task.");
    const raw = String(rawNumerator ?? "");
    const parsed = /^\d+$/.test(raw) ? Number(raw) : NaN;
    const classification = evaluateEquivalentNumerator({
      targetFraction: task.targetFraction,
      numerator: Number.isSafeInteger(parsed) ? parsed : NaN,
      denominator: task.answerDenominator
    });
    const progress = readProgress();
    const responses = progress.responsesByTask[taskId] || [];
    responses.push({ rawNumerator: raw, classification });
    progress.responsesByTask[taskId] = responses;
    if (classification === "correct" && !progress.completedTaskIds.includes(taskId)) {
      progress.completedTaskIds.push(taskId);
    }
    storage.setItem(storageKey, JSON.stringify(progress));
    return Object.freeze({ classification, progress: getProgress() });
  }

  function reset() { storage.removeItem(storageKey); }
  return Object.freeze({ getProgress, getNextTaskId, recordResponse, reset });
}

export {
  FRACTION_CONSTRUCTION_PRACTICE_TASKS,
  createFractionConstructionPracticeSession,
  evaluateEquivalentNumerator
};
