const FRACTION_ADDITION_PRACTICE_TASKS = Object.freeze([
  Object.freeze({
    id: "fraction-addition-practice-01",
    leftFraction: Object.freeze({ numerator: 1, denominator: 3 }),
    rightFraction: Object.freeze({ numerator: 1, denominator: 4 }),
    operation: "addition",
    operationSymbol: "+"
  })
]);

const STEP_IDS = Object.freeze([
  "common_denominator",
  "left_equivalent_numerator",
  "right_equivalent_numerator",
  "addition_result"
]);
const RESPONSE_CLASSIFICATIONS = Object.freeze([
  "valid", "not_common_denominator", "not_equivalent", "arithmetic_error", "invalid_input"
]);

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new TypeError("At least one fraction addition task is required.");
  }
  const ids = new Set();
  return Object.freeze(tasks.map((task, index) => {
    const id = String(task?.id || "").trim();
    const left = task?.leftFraction;
    const right = task?.rightFraction;
    const validFraction = fraction => fraction &&
      Number.isSafeInteger(fraction.numerator) && fraction.numerator > 0 &&
      Number.isSafeInteger(fraction.denominator) && fraction.denominator > 0;
    if (!id || ids.has(id)) throw new TypeError("Fraction addition task IDs must be non-empty and unique.");
    if (!validFraction(left) || !validFraction(right)) {
      throw new TypeError("Each fraction addition task requires positive integer fractions.");
    }
    if (task.operation != null && task.operation !== "addition") {
      throw new TypeError("Only addition tasks are supported by this session.");
    }
    ids.add(id);
    return Object.freeze({
      id,
      leftFraction: Object.freeze({ numerator: left.numerator, denominator: left.denominator }),
      rightFraction: Object.freeze({ numerator: right.numerator, denominator: right.denominator }),
      operation: "addition",
      operationSymbol: "+"
    });
  }));
}

function createFractionAdditionPracticeSession({
  learnerKey,
  storage = globalThis.localStorage,
  tasks = FRACTION_ADDITION_PRACTICE_TASKS
} = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  const configuredTasks = normalizeTasks(tasks);
  const taskById = new Map(configuredTasks.map(task => [task.id, task]));
  const storageKey = "pacogo:fraction-addition-practice:v1:" + encodeURIComponent(learner);
  const emptyProgress = () => ({
    schemaVersion: 1, completedTaskIds: [], completedStepIdsByTask: {}, responsesByTask: {}
  });

  function readProgress() {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyProgress();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error("Saved fraction addition practice is unreadable."); }
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.completedTaskIds) ||
        !parsed.completedStepIdsByTask || typeof parsed.completedStepIdsByTask !== "object" ||
        !parsed.responsesByTask || typeof parsed.responsesByTask !== "object") {
      throw new Error("Saved fraction addition practice has an unsupported format.");
    }
    const completedStepIdsByTask = {};
    const responsesByTask = {};
    for (const task of configuredTasks) {
      const completedStepIds = parsed.completedStepIdsByTask[task.id] || [];
      const responses = parsed.responsesByTask[task.id] || [];
      if (!Array.isArray(completedStepIds) || !Array.isArray(responses) ||
          completedStepIds.some((id, index) => STEP_IDS[index] !== id) ||
          completedStepIds.length > STEP_IDS.length) {
        throw new Error("Saved fraction addition practice contains an invalid step sequence.");
      }
      for (const response of responses) {
        if (!response || !STEP_IDS.includes(response.stepId) ||
            typeof response.rawValue !== "string" ||
            !RESPONSE_CLASSIFICATIONS.includes(response.classification)) {
          throw new Error("Saved fraction addition practice contains an invalid response.");
        }
      }
      completedStepIdsByTask[task.id] = [...completedStepIds];
      responsesByTask[task.id] = responses.map(response => ({
        stepId: response.stepId, rawValue: response.rawValue, classification: response.classification
      }));
    }
    return {
      schemaVersion: 1,
      completedTaskIds: parsed.completedTaskIds.filter(id => taskById.has(id)),
      completedStepIdsByTask,
      responsesByTask
    };
  }

  function getValidValue(progress, taskId, stepId) {
    const responses = progress.responsesByTask[taskId] || [];
    const response = [...responses].reverse().find(item =>
      item.stepId === stepId && item.classification === "valid"
    );
    return response ? Number(response.rawValue) : null;
  }

  function getActiveTask(progress) {
    return configuredTasks.find(task => !progress.completedTaskIds.includes(task.id)) || null;
  }

  function getCurrentStep() {
    const progress = readProgress();
    const task = getActiveTask(progress);
    if (!task) return null;
    const completed = progress.completedStepIdsByTask[task.id] || [];
    const stepId = STEP_IDS.find(id => !completed.includes(id));
    const denominator = getValidValue(progress, task.id, "common_denominator");
    const leftNumerator = getValidValue(progress, task.id, "left_equivalent_numerator");
    const rightNumerator = getValidValue(progress, task.id, "right_equivalent_numerator");
    const left = task.leftFraction;
    const right = task.rightFraction;
    if (stepId === "common_denominator") {
      return Object.freeze({
        taskId: task.id, taskNumber: configuredTasks.indexOf(task) + 1,
        totalTasks: configuredTasks.length, stepId, stepNumber: 1, totalSteps: STEP_IDS.length,
        prompt: "Kies een gemeenschappelijke noemer voor de twee getoonde breuken.",
        inputLabel: "Gemeenschappelijke noemer",
        expression: left.numerator + "/" + left.denominator + " + " +
          right.numerator + "/" + right.denominator + " → noemer ?"
      });
    }
    if (stepId === "left_equivalent_numerator") {
      return Object.freeze({
        taskId: task.id, taskNumber: configuredTasks.indexOf(task) + 1,
        totalTasks: configuredTasks.length, stepId, stepNumber: 2, totalSteps: STEP_IDS.length,
        prompt: "Welke teller hoort bij de eerste breuk als de noemer " + denominator + " wordt?",
        inputLabel: "Nieuwe teller voor " + left.numerator + "/" + left.denominator,
        expression: left.numerator + "/" + left.denominator + " = ?/" + denominator
      });
    }
    if (stepId === "right_equivalent_numerator") {
      return Object.freeze({
        taskId: task.id, taskNumber: configuredTasks.indexOf(task) + 1,
        totalTasks: configuredTasks.length, stepId, stepNumber: 3, totalSteps: STEP_IDS.length,
        prompt: "Welke teller hoort bij de tweede breuk als de noemer " + denominator + " wordt?",
        inputLabel: "Nieuwe teller voor " + right.numerator + "/" + right.denominator,
        expression: right.numerator + "/" + right.denominator + " = ?/" + denominator
      });
    }
    if (stepId === "addition_result") {
      return Object.freeze({
        taskId: task.id, taskNumber: configuredTasks.indexOf(task) + 1,
        totalTasks: configuredTasks.length, stepId, stepNumber: 4, totalSteps: STEP_IDS.length,
        prompt: "Tel de tellers op. De noemer blijft hetzelfde.",
        inputLabel: "Teller van de som",
        expression: leftNumerator + "/" + denominator + " + " +
          rightNumerator + "/" + denominator + " = ?/" + denominator
      });
    }
    return null;
  }

  function getCompletion(taskId) {
    const progress = readProgress();
    const task = taskId == null
      ? (configuredTasks.length === 1 ? configuredTasks[0] : configuredTasks.find(item => progress.completedTaskIds.includes(item.id)))
      : taskById.get(taskId);
    if (!task || !progress.completedTaskIds.includes(task.id)) return null;
    return Object.freeze({
      taskId: task.id,
      leftNumerator: getValidValue(progress, task.id, "left_equivalent_numerator"),
      rightNumerator: getValidValue(progress, task.id, "right_equivalent_numerator"),
      resultNumerator: getValidValue(progress, task.id, "addition_result"),
      denominator: getValidValue(progress, task.id, "common_denominator")
    });
  }

  function getProgress() {
    const progress = readProgress();
    const completedStepCount = configuredTasks.reduce((total, task) =>
      total + (progress.completedStepIdsByTask[task.id] || []).length, 0);
    const attemptCount = configuredTasks.reduce((total, task) =>
      total + (progress.responsesByTask[task.id] || []).length, 0);
    const completedTaskCount = configuredTasks.filter(task =>
      progress.completedTaskIds.includes(task.id)).length;
    const activeTask = getActiveTask(progress);
    return Object.freeze({
      completedStepCount,
      totalStepCount: configuredTasks.length * STEP_IDS.length,
      attemptCount,
      completedTaskCount,
      totalTaskCount: configuredTasks.length,
      currentTaskId: activeTask?.id || null,
      isComplete: completedTaskCount === configuredTasks.length
    });
  }

  function recordResponse({ rawValue } = {}) {
    const current = getCurrentStep();
    if (!current) throw new Error("The fraction addition practice session is already complete.");
    const task = taskById.get(current.taskId);
    const raw = String(rawValue ?? "");
    const parsed = /^[0-9]+$/.test(raw) ? Number(raw) : NaN;
    const value = Number.isSafeInteger(parsed) ? parsed : NaN;
    let classification = "invalid_input";
    const progress = readProgress();
    const denominator = getValidValue(progress, task.id, "common_denominator");
    const leftNumerator = getValidValue(progress, task.id, "left_equivalent_numerator");
    const rightNumerator = getValidValue(progress, task.id, "right_equivalent_numerator");

    if (Number.isSafeInteger(value) && value > 0) {
      if (current.stepId === "common_denominator") {
        classification = value % task.leftFraction.denominator === 0 &&
          value % task.rightFraction.denominator === 0 ? "valid" : "not_common_denominator";
      } else if (current.stepId === "left_equivalent_numerator") {
        const expected = task.leftFraction.numerator * (denominator / task.leftFraction.denominator);
        classification = value === expected ? "valid" : "not_equivalent";
      } else if (current.stepId === "right_equivalent_numerator") {
        const expected = task.rightFraction.numerator * (denominator / task.rightFraction.denominator);
        classification = value === expected ? "valid" : "not_equivalent";
      } else if (current.stepId === "addition_result") {
        classification = value === leftNumerator + rightNumerator ? "valid" : "arithmetic_error";
      }
    }

    const responses = progress.responsesByTask[task.id] || [];
    responses.push({ stepId: current.stepId, rawValue: raw, classification });
    progress.responsesByTask[task.id] = responses;
    if (classification === "valid") {
      const completed = progress.completedStepIdsByTask[task.id] || [];
      completed.push(current.stepId);
      progress.completedStepIdsByTask[task.id] = completed;
      if (completed.length === STEP_IDS.length && !progress.completedTaskIds.includes(task.id)) {
        progress.completedTaskIds.push(task.id);
      }
    }
    storage.setItem(storageKey, JSON.stringify(progress));
    return Object.freeze({
      classification, progress: getProgress(), completion: getCompletion(task.id)
    });
  }

  function reset() { storage.removeItem(storageKey); }
  return Object.freeze({ getCurrentStep, getProgress, getCompletion, recordResponse, reset });
}

export { FRACTION_ADDITION_PRACTICE_TASKS, createFractionAdditionPracticeSession };
