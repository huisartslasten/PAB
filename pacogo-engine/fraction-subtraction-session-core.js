const VALID_COMPLETION_MODES = Object.freeze(["automatic", "explicit"]);

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new TypeError("At least one subtraction task is required");
  }
  const ids = new Set();
  return Object.freeze(tasks.map(task => {
    const id = String(task?.id || "").trim();
    if (!id || ids.has(id)) throw new TypeError("Subtraction task IDs must be non-empty and unique");
    ids.add(id);
    return Object.freeze({ ...task, id });
  }));
}

function normalizeInitialState(initialState, taskIds) {
  const source = initialState == null ? {} : initialState;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new TypeError("initialState must be an object");
  }
  const completed = source.completedTaskIds == null ? [] : source.completedTaskIds;
  const responses = source.responsesByTask == null ? {} : source.responsesByTask;
  if (!Array.isArray(completed) || !responses || typeof responses !== "object" || Array.isArray(responses)) {
    throw new TypeError("initialState contains invalid subtraction progress");
  }
  const completedTaskIds = [...new Set(completed.filter(id => taskIds.has(id)))];
  const responsesByTask = {};
  for (const [taskId, attempts] of Object.entries(responses)) {
    if (!taskIds.has(taskId)) continue;
    if (!Array.isArray(attempts)) throw new TypeError("Subtraction attempts must be arrays");
    responsesByTask[taskId] = attempts.map(attempt => {
      if (!attempt || typeof attempt.classification !== "string") {
        throw new TypeError("Each subtraction attempt requires a classification");
      }
      return Object.freeze({ ...attempt });
    });
  }
  return { completedTaskIds, responsesByTask };
}

/** Shared, task-neutral progression and attempt lifecycle for fraction subtraction modes. */
function createFractionSubtractionSessionCore({
  tasks,
  initialState = null,
  completionMode = "automatic",
  onStateChange = null
} = {}) {
  if (!VALID_COMPLETION_MODES.includes(completionMode)) {
    throw new TypeError("completionMode must be automatic or explicit");
  }
  if (onStateChange !== null && typeof onStateChange !== "function") {
    throw new TypeError("onStateChange must be a function when supplied");
  }
  const configuredTasks = normalizeTasks(tasks);
  const taskIds = new Set(configuredTasks.map(task => task.id));
  let state = normalizeInitialState(initialState, taskIds);
  let pendingCompletionTaskId = null;

  function snapshot() {
    return Object.freeze({
      completedTaskIds: Object.freeze([...state.completedTaskIds]),
      responsesByTask: Object.freeze(Object.fromEntries(Object.entries(state.responsesByTask)
        .map(([id, attempts]) => [id, Object.freeze(attempts.map(attempt => Object.freeze({ ...attempt })))])))
    });
  }

  function commit() {
    if (onStateChange) onStateChange(snapshot());
  }

  function getCurrentTask() {
    return configuredTasks.find(task => !state.completedTaskIds.includes(task.id)) || null;
  }

  function getProgress() {
    const completedCount = state.completedTaskIds.length;
    const attemptCount = Object.values(state.responsesByTask).reduce((sum, attempts) => sum + attempts.length, 0);
    const currentTask = getCurrentTask();
    return Object.freeze({
      completedCount,
      totalCount: configuredTasks.length,
      attemptCount,
      currentTaskId: currentTask?.id || null,
      isComplete: completedCount === configuredTasks.length
    });
  }

  function recordAttempt({ taskId, classification, response = {} } = {}) {
    const current = getCurrentTask();
    if (!current) throw new Error("The fraction subtraction session is already complete");
    if (taskId !== current.id) throw new Error("An attempt can only be recorded for the current subtraction task");
    if (typeof classification !== "string" || !classification.trim()) {
      throw new TypeError("A subtraction attempt classification is required");
    }
    if (!response || typeof response !== "object" || Array.isArray(response)) {
      throw new TypeError("A subtraction response must be an object");
    }
    const attempts = state.responsesByTask[current.id] || [];
    state.responsesByTask[current.id] = [...attempts, Object.freeze({ ...response, classification })];
    if (classification === "valid") {
      if (completionMode === "automatic") state.completedTaskIds = [...state.completedTaskIds, current.id];
      else pendingCompletionTaskId = current.id;
    } else pendingCompletionTaskId = null;
    commit();
    return Object.freeze({ classification, progress: getProgress(), currentTask: getCurrentTask() });
  }

  function invalidatePendingCompletion() {
    if (completionMode !== "explicit" || pendingCompletionTaskId === null) return false;
    pendingCompletionTaskId = null;
    return true;
  }

  function advance() {
    const current = getCurrentTask();
    if (!current) throw new Error("The fraction subtraction session is already complete");
    if (completionMode !== "explicit" || pendingCompletionTaskId !== current.id) {
      throw new Error("A correct current-task check is required before advancing");
    }
    state.completedTaskIds = [...state.completedTaskIds, current.id];
    pendingCompletionTaskId = null;
    commit();
    return Object.freeze({ currentTask: getCurrentTask(), progress: getProgress() });
  }

  function reset() {
    state = { completedTaskIds: [], responsesByTask: {} };
    pendingCompletionTaskId = null;
    commit();
    return getProgress();
  }

  return Object.freeze({
    tasks: configuredTasks, getCurrentTask, getProgress, recordAttempt,
    invalidatePendingCompletion, advance, getState: snapshot, reset
  });
}

export { createFractionSubtractionSessionCore };
