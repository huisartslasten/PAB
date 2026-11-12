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

function createFractionAdditionPracticeSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  const task = FRACTION_ADDITION_PRACTICE_TASKS[0];
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
          !["valid", "not_common_denominator", "not_equivalent", "arithmetic_error", "invalid_input"].includes(response.classification)) {
        throw new Error("Saved fraction addition practice contains an invalid response.");
      }
    }
    return {
      schemaVersion: 1,
      completedTaskIds: parsed.completedTaskIds.filter(id => id === task.id),
      completedStepIdsByTask: { [task.id]: [...completedStepIds] },
      responsesByTask: { [task.id]: responses.map(response => ({
        stepId: response.stepId, rawValue: response.rawValue, classification: response.classification
      })) }
    };
  }

  function getValidValue(progress, stepId) {
    const responses = progress.responsesByTask[task.id] || [];
    const response = [...responses].reverse().find(item =>
      item.stepId === stepId && item.classification === "valid"
    );
    return response ? Number(response.rawValue) : null;
  }

  function getCurrentStep() {
    const progress = readProgress();
    if (progress.completedTaskIds.includes(task.id)) return null;
    const completed = progress.completedStepIdsByTask[task.id] || [];
    const stepId = STEP_IDS.find(id => !completed.includes(id));
    const denominator = getValidValue(progress, "common_denominator");
    const leftNumerator = getValidValue(progress, "left_equivalent_numerator");
    const rightNumerator = getValidValue(progress, "right_equivalent_numerator");
    if (stepId === "common_denominator") {
      return Object.freeze({
        taskId: task.id, stepId, stepNumber: 1, totalSteps: 4,
        prompt: "Kies een gemeenschappelijke noemer voor 1/3 en 1/4.",
        inputLabel: "Gemeenschappelijke noemer",
        expression: "1/3 + 1/4 → noemer ?"
      });
    }
    if (stepId === "left_equivalent_numerator") {
      return Object.freeze({
        taskId: task.id, stepId, stepNumber: 2, totalSteps: 4,
        prompt: "Welke teller hoort bij 1/3 als de noemer " + denominator + " wordt?",
        inputLabel: "Nieuwe teller voor 1/3",
        expression: "1/3 = ?/" + denominator
      });
    }
    if (stepId === "right_equivalent_numerator") {
      return Object.freeze({
        taskId: task.id, stepId, stepNumber: 3, totalSteps: 4,
        prompt: "Welke teller hoort bij 1/4 als de noemer " + denominator + " wordt?",
        inputLabel: "Nieuwe teller voor 1/4",
        expression: "1/4 = ?/" + denominator
      });
    }
    if (stepId === "addition_result") {
      return Object.freeze({
        taskId: task.id, stepId, stepNumber: 4, totalSteps: 4,
        prompt: "Tel de tellers op. De noemer blijft hetzelfde, want beide breuken zijn nu in twaalfden.",
        inputLabel: "Teller van de som",
        expression: leftNumerator + "/" + denominator + " + " + rightNumerator + "/" + denominator + " = ?/" + denominator
      });
    }
    return null;
  }

  function getCompletion() {
    const progress = readProgress();
    if (!progress.completedTaskIds.includes(task.id)) return null;
    return Object.freeze({
      leftNumerator: getValidValue(progress, "left_equivalent_numerator"),
      rightNumerator: getValidValue(progress, "right_equivalent_numerator"),
      resultNumerator: getValidValue(progress, "addition_result"),
      denominator: getValidValue(progress, "common_denominator")
    });
  }

  function getProgress() {
    const progress = readProgress();
    return Object.freeze({
      completedStepCount: (progress.completedStepIdsByTask[task.id] || []).length,
      totalStepCount: STEP_IDS.length,
      attemptCount: (progress.responsesByTask[task.id] || []).length,
      isComplete: progress.completedTaskIds.includes(task.id)
    });
  }

  function recordResponse({ rawValue } = {}) {
    const current = getCurrentStep();
    if (!current) throw new Error("The fraction addition practice task is already complete.");
    const raw = String(rawValue ?? "");
    const parsed = /^[0-9]+$/.test(raw) ? Number(raw) : NaN;
    const value = Number.isSafeInteger(parsed) ? parsed : NaN;
    let classification = "invalid_input";
    const progress = readProgress();
    const denominator = getValidValue(progress, "common_denominator");
    const leftNumerator = getValidValue(progress, "left_equivalent_numerator");
    const rightNumerator = getValidValue(progress, "right_equivalent_numerator");

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
      classification, progress: getProgress(), completion: getCompletion()
    });
  }

  function reset() { storage.removeItem(storageKey); }
  return Object.freeze({ getCurrentStep, getProgress, getCompletion, recordResponse, reset });
}

export { FRACTION_ADDITION_PRACTICE_TASKS, createFractionAdditionPracticeSession };
