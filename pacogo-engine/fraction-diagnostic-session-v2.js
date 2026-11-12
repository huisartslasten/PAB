import {
  FRACTION_DIAGNOSTIC_CLASSIFICATIONS as C,
  evaluateCommonDenominator,
  evaluateConvertedNumerator,
  evaluateMixedNumberConversion,
  evaluateOperation
} from "./fraction-diagnostic-assessment.js";

const TASKS = Object.freeze({
  F1: Object.freeze({
    title: "Gelijkwaardige breuken",
    actions: Object.freeze([
      { actionId: "factor", label: "Vermenigvuldigingsfactor", prompt: "Met welke factor wordt de noemer vermenigvuldigd?", expression: "2/3 = ?/6", dependencies: [] },
      { actionId: "new_numerator", label: "Nieuwe teller", prompt: "Welke teller hoort daarbij?", expression: "2/3 = ?/6", dependencies: ["factor"] }
    ])
  }),
  F2: Object.freeze({
    title: "Breuken optellen",
    actions: Object.freeze([
      { actionId: "common_denominator", label: "Gemeenschappelijke noemer", prompt: "Welke noemer kan voor beide breuken worden gebruikt?", expression: "1/3 + 1/4", dependencies: [] },
      { actionId: "first_numerator", label: "Eerste nieuwe teller", prompt: "Welke teller hoort bij de eerste gelijkwaardige breuk?", expression: "1/3 = ?/noemer", dependencies: ["common_denominator"] },
      { actionId: "second_numerator", label: "Tweede nieuwe teller", prompt: "Welke teller hoort bij de tweede gelijkwaardige breuk?", expression: "1/4 = ?/noemer", dependencies: ["common_denominator"] },
      { actionId: "result_numerator", label: "Som van de tellers", prompt: "Tel de twee tellers die je zelf hebt ingevuld bij elkaar op.", expression: "eerste teller + tweede teller", dependencies: ["first_numerator", "second_numerator"] }
    ])
  }),
  F3: Object.freeze({
    title: "Breuken aftrekken",
    actions: Object.freeze([
      { actionId: "common_denominator", label: "Gemeenschappelijke noemer", prompt: "Welke noemer kan voor beide breuken worden gebruikt?", expression: "1/2 − 2/5", dependencies: [] },
      { actionId: "first_numerator", label: "Eerste nieuwe teller", prompt: "Welke teller hoort bij de eerste gelijkwaardige breuk?", expression: "1/2 = ?/noemer", dependencies: ["common_denominator"] },
      { actionId: "second_numerator", label: "Tweede nieuwe teller", prompt: "Welke teller hoort bij de tweede gelijkwaardige breuk?", expression: "2/5 = ?/noemer", dependencies: ["common_denominator"] },
      { actionId: "result_numerator", label: "Verschil van de tellers", prompt: "Trek de tweede teller af van de eerste teller.", expression: "eerste teller − tweede teller", dependencies: ["first_numerator", "second_numerator"] }
    ])
  }),
  F4: Object.freeze({
    title: "Gemengde breuk aftrekken",
    actions: Object.freeze([
      { actionId: "mixed_numerator", label: "Teller na omzetten", prompt: "Welke onvereenvoudigde teller krijg je als je het gemengde getal omzet?", expression: "1 1/3 = ?/3", dependencies: [] },
      { actionId: "common_denominator", label: "Gemeenschappelijke noemer", prompt: "Welke noemer kan voor beide breuken worden gebruikt?", expression: "?/3 − 2/5", dependencies: ["mixed_numerator"] },
      { actionId: "first_numerator", label: "Eerste nieuwe teller", prompt: "Welke teller hoort bij de eerste gelijkwaardige breuk?", expression: "?/3 = ?/noemer", dependencies: ["mixed_numerator", "common_denominator"] },
      { actionId: "second_numerator", label: "Tweede nieuwe teller", prompt: "Welke teller hoort bij de tweede gelijkwaardige breuk?", expression: "2/5 = ?/noemer", dependencies: ["common_denominator"] },
      { actionId: "result_numerator", label: "Verschil van de tellers", prompt: "Trek de tweede teller af van de eerste teller.", expression: "eerste teller − tweede teller", dependencies: ["first_numerator", "second_numerator"] }
    ])
  })
});

const STORAGE_PREFIX = "pacogo:fraction-diagnostic:v2:";
const TASK_IDS = Object.freeze(["F1", "F2", "F3", "F4"]);
const CLASSIFICATION_VALUES = new Set(Object.values(C));

function emptySession(learnerKey) {
  return {
    schemaVersion: 2,
    taskSetVersion: "0.1",
    assessmentContractVersion: "0.1",
    learnerKey,
    status: "in_progress",
    tasks: {
      F1: { status: "incomplete", actions: [] },
      F2: { status: "incomplete", actions: [] },
      F3: { status: "incomplete", actions: [] },
      F4: { status: "incomplete", reason: null, actions: [] }
    }
  };
}

function validateSession(value, learnerKey) {
  if (!value || value.schemaVersion !== 2 || value.taskSetVersion !== "0.1" ||
      value.assessmentContractVersion !== "0.1" || value.learnerKey !== learnerKey ||
      !["in_progress", "completed", "stopped"].includes(value.status) ||
      !value.tasks || typeof value.tasks !== "object" || Array.isArray(value.tasks)) {
    throw new Error("Saved v2 diagnostic session has an invalid schema.");
  }
  if (Object.keys(value.tasks).sort().join(",") !== [...TASK_IDS].sort().join(",")) {
    throw new Error("Saved v2 diagnostic task set is invalid.");
  }
  for (const taskId of TASK_IDS) {
    const task = value.tasks[taskId];
    if (!task || !["incomplete", "completed", "not_administered"].includes(task.status) ||
        !Array.isArray(task.actions)) throw new Error("Saved v2 diagnostic task is invalid.");
    const definitions = TASKS[taskId].actions;
    if (task.actions.length > definitions.length) throw new Error("Saved v2 action sequence is too long.");
    task.actions.forEach((entry, index) => {
      if (!entry || entry.actionId !== definitions[index].actionId ||
          !CLASSIFICATION_VALUES.has(entry.classification) ||
          !Number.isSafeInteger(entry.rawValue) || entry.rawValue < 0 ||
          !Array.isArray(entry.dependencyActionIds) ||
          entry.dependencyActionIds.some(id => typeof id !== "string")) {
        throw new Error("Saved v2 action sequence is invalid.");
      }
    });
    if (task.status === "completed" && task.actions.length !== definitions.length) {
      throw new Error("A completed task must contain every action.");
    }
    if (task.status === "not_administered" && (taskId !== "F4" || task.actions.length !== 0 ||
        task.reason !== "prerequisite_not_demonstrated")) {
      throw new Error("The not-administered task state is invalid.");
    }
  }
  return value;
}

function actionValue(task, actionId) {
  return task.actions.find(action => action.actionId === actionId)?.rawValue;
}
function actionClass(task, actionId) {
  return task.actions.find(action => action.actionId === actionId)?.classification ?? C.MISSING;
}
function ref(taskId, actionId) { return taskId + "." + actionId; }

function classify(taskId, action, session) {
  const task = session.tasks[taskId];
  const prior = id => actionValue(task, id);
  const priorClass = id => actionClass(task, id);
  if (taskId === "F1" && action.actionId === "factor") {
    return { classification: action.rawValue === 2 ? C.VALID : C.INVALID_RELATION, dependencyActionIds: [] };
  }
  if (taskId === "F1" && action.actionId === "new_numerator") {
    const followsFactor = action.rawValue === 2 * prior("factor");
    const classification = priorClass("factor") === C.VALID
      ? (action.rawValue === 4 ? C.VALID : C.INVALID_RELATION)
      : (followsFactor ? C.DEPENDENT_CONSISTENT : C.AMBIGUOUS);
    return { classification, dependencyActionIds: [ref("F1", "factor")] };
  }
  if (action.actionId === "common_denominator") {
    const pair = taskId === "F2" ? [3, 4] : taskId === "F3" ? [2, 5] : [3, 5];
    const result = evaluateCommonDenominator({
      firstDenominator: pair[0], secondDenominator: pair[1], commonDenominator: action.rawValue
    });
    return { classification: result.classification, dependencyActionIds: action.dependencies.map(id => ref(taskId, id)) };
  }
  if (taskId === "F4" && action.actionId === "mixed_numerator") {
    const result = evaluateMixedNumberConversion({
      whole: 1, numerator: 1, denominator: 3, submittedNumerator: action.rawValue
    });
    return { classification: result.classification, dependencyActionIds: [] };
  }
  if (action.actionId === "first_numerator" || action.actionId === "second_numerator") {
    const source = taskId === "F2"
      ? (action.actionId === "first_numerator" ? [1, 3] : [1, 4])
      : taskId === "F3"
        ? (action.actionId === "first_numerator" ? [1, 2] : [2, 5])
        : (action.actionId === "first_numerator" ? [prior("mixed_numerator"), 3] : [2, 5]);
    const denominator = prior("common_denominator");
    const prerequisite = priorClass("common_denominator");
    const result = evaluateConvertedNumerator({
      sourceNumerator: source[0], sourceDenominator: source[1],
      commonDenominator: denominator, submittedNumerator: action.rawValue,
      prerequisiteClassification: prerequisite
    });
    return {
      classification: result.classification,
      dependencyActionIds: action.dependencies.map(id => ref(taskId, id))
    };
  }
  if (action.actionId === "result_numerator") {
    const operation = taskId === "F2" ? "add" : "subtract";
    const result = evaluateOperation({
      operation,
      firstNumerator: prior("first_numerator"),
      secondNumerator: prior("second_numerator"),
      submittedResult: action.rawValue,
      prerequisiteClassifications: [priorClass("first_numerator"), priorClass("second_numerator")]
    });
    return {
      classification: result.classification,
      dependencyActionIds: action.dependencies.map(id => ref(taskId, id))
    };
  }
  throw new Error("Unknown diagnostic action.");
}

function createFractionDiagnosticSessionV2({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || !["getItem", "setItem"].every(method => typeof storage[method] === "function")) {
    throw new TypeError("A compatible local storage object is required.");
  }
  const storageKey = STORAGE_PREFIX + encodeURIComponent(learner);
  const read = () => {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptySession(learner);
    let parsed;
    try { parsed = JSON.parse(raw); } catch { throw new Error("Saved v2 diagnostic session is unreadable."); }
    return validateSession(parsed, learner);
  };
  const write = session => storage.setItem(storageKey, JSON.stringify(session));
  const current = session => {
    if (session.status !== "in_progress") return null;
    for (const taskId of ["F1", "F2", "F3"]) {
      const task = session.tasks[taskId];
      if (task.status !== "completed") {
        const action = TASKS[taskId].actions[task.actions.length];
        return { taskId, taskTitle: TASKS[taskId].title, action: action ? { ...action } : null };
      }
    }
    const f3Valid = TASKS.F3.actions.every(action => actionClass(session.tasks.F3, action.actionId) === C.VALID);
    if (!f3Valid) {
      session.tasks.F4.status = "not_administered";
      session.tasks.F4.reason = "prerequisite_not_demonstrated";
      session.status = "completed";
      write(session);
      return null;
    }
    const f4 = session.tasks.F4;
    const action = TASKS.F4.actions[f4.actions.length];
    if (!action) return null;
    return { taskId: "F4", taskTitle: TASKS.F4.title, action: { ...action } };
  };
  function getCurrentAction() {
    const session = read();
    const next = current(session);
    return next ? Object.freeze(next) : null;
  }
  function getProgress() {
    const session = read();
    const completedTasks = TASK_IDS.filter(id => session.tasks[id].status === "completed").length;
    const submittedActions = TASK_IDS.reduce((sum, id) => sum + session.tasks[id].actions.length, 0);
    return Object.freeze({
      status: session.status,
      completedTasks,
      totalCoreTasks: 3,
      submittedActions,
      currentTaskId: getCurrentAction()?.taskId ?? null,
      isComplete: session.status === "completed",
      isStopped: session.status === "stopped"
    });
  }
  function getSessionSnapshot() {
    return Object.freeze(JSON.parse(JSON.stringify(read())));
  }
  function submitCurrentAction(rawValue) {
    if (!Number.isSafeInteger(rawValue) || rawValue < 0) {
      throw new TypeError("A response must be a non-negative whole number.");
    }
    const session = read();
    const next = current(session);
    if (!next?.action) throw new Error("There is no current diagnostic action.");
    const task = session.tasks[next.taskId];
    const assessed = classify(next.taskId, { ...next.action, rawValue }, session);
    task.actions.push({
      actionId: next.action.actionId,
      rawValue,
      classification: assessed.classification,
      dependencyActionIds: assessed.dependencyActionIds
    });
    if (task.actions.length === TASKS[next.taskId].actions.length) task.status = "completed";
    if (next.taskId === "F4" && task.status === "completed") session.status = "completed";
    write(session);
    const following = current(session);
    return Object.freeze({
      classification: assessed.classification,
      progress: getProgress(),
      hasNextAction: Boolean(following)
    });
  }
  function stop() {
    const session = read();
    if (session.status !== "in_progress") return getProgress();
    session.status = "stopped";
    write(session);
    return getProgress();
  }
  return Object.freeze({ getCurrentAction, getProgress, getSessionSnapshot, submitCurrentAction, stop });
}

export { createFractionDiagnosticSessionV2, TASKS as FRACTION_DIAGNOSTIC_TASKS_V2 };
