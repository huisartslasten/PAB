const FRACTION_WHOLE_NUMBER_TIMES_PROPER_FRACTION_KEY = "pacogo:fraction-whole-number-times-proper-fraction:v1:";

function createFractionWholeNumberTimesProperFractionSession({
  learnerKey,
  storage = globalThis.localStorage,
  tasks
} = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length !== 15) {
    throw new TypeError("Exactly 15 multiplication tasks are required.");
  }
  const normalized = Object.freeze(tasks.map((task, index) => {
    const { wholeNumber, numerator, denominator } = task || {};
    if (!task?.id || typeof task.id !== "string" ||
        !Number.isSafeInteger(wholeNumber) || wholeNumber <= 0 ||
        !Number.isSafeInteger(numerator) || numerator <= 0 ||
        !Number.isSafeInteger(denominator) || denominator <= numerator ||
        wholeNumber % denominator !== 0) {
      throw new TypeError("Task " + index + " must multiply a positive whole number by a proper fraction with an integer quotient.");
    }
    return Object.freeze({
      id: task.id, wholeNumber, numerator, denominator,
      expectedAnswer: (wholeNumber / denominator) * numerator
    });
  }));
  if (new Set(normalized.map(task => task.id)).size !== normalized.length) {
    throw new TypeError("Task IDs must be unique.");
  }
  const key = FRACTION_WHOLE_NUMBER_TIMES_PROPER_FRACTION_KEY + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], attemptsByTask: {} });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("Saved multiplication practice is unreadable."); }
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.completedTaskIds) ||
        !value.attemptsByTask || typeof value.attemptsByTask !== "object") {
      throw new Error("Saved multiplication practice has an unsupported format.");
    }
    return {
      schemaVersion: 1,
      completedTaskIds: value.completedTaskIds.filter(id => normalized.some(task => task.id === id)),
      attemptsByTask: Object.fromEntries(normalized.map(task => [
        task.id, Number.isSafeInteger(value.attemptsByTask[task.id]) && value.attemptsByTask[task.id] >= 0
          ? value.attemptsByTask[task.id] : 0
      ]))
    };
  }
  function getCurrentTask() {
    const state = read();
    const task = normalized.find(item => !state.completedTaskIds.includes(item.id));
    if (!task) return null;
    return Object.freeze({
      ...task,
      taskNumber: normalized.indexOf(task) + 1,
      totalTasks: normalized.length
    });
  }
  function getProgress() {
    const state = read();
    const completedCount = state.completedTaskIds.length;
    return Object.freeze({
      completedCount,
      totalCount: normalized.length,
      attemptCount: Object.values(state.attemptsByTask).reduce((sum, count) => sum + count, 0),
      isComplete: completedCount === normalized.length
    });
  }
  function recordAnswer({ answer } = {}) {
    const task = getCurrentTask();
    if (!task) throw new Error("The multiplication practice is complete.");
    const raw = String(answer ?? "").trim();
    const validInteger = /^[0-9]+$/.test(raw);
    const numericAnswer = validInteger ? Number(raw) : NaN;
    const classification = !validInteger || !Number.isSafeInteger(numericAnswer) || numericAnswer <= 0
      ? "invalid_input"
      : numericAnswer === task.expectedAnswer ? "valid" : "incorrect_answer";
    const state = read();
    state.attemptsByTask[task.id] = (state.attemptsByTask[task.id] || 0) + 1;
    if (classification === "valid") state.completedTaskIds.push(task.id);
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, correct: classification === "valid", progress: getProgress() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}
export { createFractionWholeNumberTimesProperFractionSession };
