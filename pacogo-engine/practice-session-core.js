const VALID_COMPLETION_MODES = Object.freeze(["automatic", "explicit"]);

/**
 * Domain-neutral lifecycle for ordered practice sessions.
 *
 * The core owns task order, attempts, progress and completion only.
 * Exercise modules own task schemas, answer evaluation, feedback, evidence
 * mapping and any domain-specific persistence contract.
 */
function createPracticeSessionCore({
  tasks,
  initialState = null,
  completionMode = "automatic",
  onStateChange = null
} = {}) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new TypeError("At least one practice task is required");
  }
  if (!VALID_COMPLETION_MODES.includes(completionMode)) {
    throw new TypeError("completionMode must be automatic or explicit");
  }
  if (onStateChange !== null && typeof onStateChange !== "function") {
    throw new TypeError("onStateChange must be a function when supplied");
  }

  const ids = new Set();
  const configuredTasks = Object.freeze(tasks.map(task => {
    const id = String(task?.id || "").trim();
    if (!id || ids.has(id)) throw new TypeError("Practice task IDs must be non-empty and unique");
    ids.add(id);
    return Object.freeze({ ...task, id });
  }));

  const taskIds = new Set(configuredTasks.map(task => task.id));
  const source = initialState == null ? {} : initialState;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new TypeError("initialState must be an object");
  }
  const completed = source.completedTaskIds == null ? [] : source.completedTaskIds;
  const responses = source.responsesByTask == null ? {} : source.responsesByTask;
  if (!Array.isArray(completed) || !responses || typeof responses !== "object" || Array.isArray(responses)) {
    throw new TypeError("initialState contains invalid practice progress");
  }
  const state = {
    completedTaskIds: [...new Set(completed.filter(id => taskIds.has(id)))],
    responsesByTask: {}
  };
  for (const [taskId, attempts] of Object.entries(responses)) {
    if (!taskIds.has(taskId)) continue;
    if (!Array.isArray(attempts)) throw new TypeError("Practice attempts must be arrays");
    state.responsesByTask[taskId] = attempts.map(attempt => {
      if (!attempt || typeof attempt.classification !== "string" || !attempt.classification.trim()) {
        throw new TypeError("Each practice attempt requires a classification");
      }
      return Object.freeze({ ...attempt });
    });
  }

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
    if (!current) throw new Error("The practice session is already complete");
    if (taskId !== current.id) throw new Error("An attempt can only be recorded for the current practice task");
    if (typeof classification !== "string" || !classification.trim()) {
      throw new TypeError("A practice attempt classification is required");
    }
    if (!response || typeof response !== "object" || Array.isArray(response)) {
      throw new TypeError("A practice response must be an object");
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
    if (!current) throw new Error("The practice session is already complete");
    if (completionMode !== "explicit" || pendingCompletionTaskId !== current.id) {
      throw new Error("A successful current-task check is required before advancing");
    }
    state.completedTaskIds = [...state.completedTaskIds, current.id];
    pendingCompletionTaskId = null;
    commit();
    return Object.freeze({ currentTask: getCurrentTask(), progress: getProgress() });
  }

  function reset() {
    state.completedTaskIds = [];
    state.responsesByTask = {};
    pendingCompletionTaskId = null;
    commit();
    return getProgress();
  }

  return Object.freeze({
    tasks: configuredTasks,
    getCurrentTask,
    getProgress,
    recordAttempt,
    invalidatePendingCompletion,
    advance,
    getState: snapshot,
    reset
  });
}

export { createPracticeSessionCore };
