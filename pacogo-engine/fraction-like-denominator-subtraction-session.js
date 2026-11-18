const FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS = Object.freeze([
  [8,9,3,9],[7,10,4,10],[11,12,5,12],[5,8,2,8],[9,10,6,10],
  [7,9,5,9],[10,12,3,12],[6,7,4,7],[8,10,3,10],[11,12,8,12],
  [7,8,2,8],[9,10,7,10],[10,12,4,12],[5,6,1,6],[8,12,5,12]
].map(([leftNumerator, denominator, rightNumerator], index) => Object.freeze({
  id: "fraction-like-denominator-subtraction-" + String(index + 1).padStart(2, "0"),
  leftFraction: Object.freeze({ numerator: leftNumerator, denominator }),
  rightFraction: Object.freeze({ numerator: rightNumerator, denominator }),
  result: Object.freeze({ numerator: leftNumerator - rightNumerator, denominator })
})));

function createFractionLikeDenominatorSubtractionSession({
  learnerKey,
  storage = globalThis.localStorage,
  tasks = FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS
} = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length === 0) throw new TypeError("At least one task is required.");
  const normalized = Object.freeze(tasks.map((task, index) => {
    const left = task?.leftFraction, right = task?.rightFraction;
    if (!task?.id || typeof task.id !== "string" ||
        !left || !right || !Number.isSafeInteger(left.numerator) ||
        !Number.isSafeInteger(right.numerator) || !Number.isSafeInteger(left.denominator) ||
        left.denominator !== right.denominator || left.numerator <= right.numerator ||
        right.numerator <= 0 || left.numerator >= left.denominator) {
      throw new TypeError("Task " + index + " must contain positive, proper like-denominator fractions with a positive difference.");
    }
    return Object.freeze({
      id: task.id,
      leftFraction: Object.freeze({ ...left }),
      rightFraction: Object.freeze({ ...right }),
      result: Object.freeze({ numerator: left.numerator - right.numerator, denominator: left.denominator })
    });
  }));
  if (new Set(normalized.map(task => task.id)).size !== normalized.length) {
    throw new TypeError("Task IDs must be unique.");
  }
  const key = "pacogo:fraction-like-denominator-subtraction:v1:" + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], attemptsByTask: {} });
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("Saved subtraction progress is unreadable."); }
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.completedTaskIds) ||
        !value.attemptsByTask || typeof value.attemptsByTask !== "object") {
      throw new Error("Saved subtraction progress has an unsupported format.");
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
  function recordAnswer({ numerator, denominator } = {}) {
    const task = getCurrentTask();
    if (!task) throw new Error("The subtraction practice is complete.");
    const n = String(numerator ?? "").trim(), d = String(denominator ?? "").trim();
    const validInteger = value => /^[0-9]+$/.test(value);
    const classification = !validInteger(n) || !validInteger(d) || Number(d) <= 0
      ? "invalid_input"
      : Number(n) === task.result.numerator && Number(d) === task.result.denominator
        ? "valid" : "incorrect_answer";
    const state = read();
    state.attemptsByTask[task.id] = (state.attemptsByTask[task.id] || 0) + 1;
    if (classification === "valid") state.completedTaskIds.push(task.id);
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, correct: classification === "valid", progress: getProgress() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentTask, getProgress, recordAnswer, reset });
}

export { FRACTION_LIKE_DENOMINATOR_SUBTRACTION_TASKS, createFractionLikeDenominatorSubtractionSession };
