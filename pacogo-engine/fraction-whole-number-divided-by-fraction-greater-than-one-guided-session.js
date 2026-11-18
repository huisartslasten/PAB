const STORAGE_PREFIX = "pacogo:fraction-whole-number-divided-by-fraction-greater-than-one-guided:v1:";
const STEP_IDS = Object.freeze(["make_divisor_whole", "scale_dividend", "calculate_quotient"]);
const CLASSIFICATIONS = Object.freeze(["valid", "invalid_input", "incorrect_answer", "requires_simplification", "not_simplified"]);

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
function parseInteger(value) {
  const raw = String(value ?? "");
  return /^[0-9]+$/.test(raw) ? Number(raw) : NaN;
}
function classifyFinalAnswer(values, task, divisorNumerator) {
  if (!values || typeof values !== "object" || values.wholeNumberEnabled !== true) return "invalid_input";
  const whole = parseInteger(values.wholeNumber);
  const numerator = parseInteger(values.numerator);
  const denominator = parseInteger(values.denominator);
  if (![whole, numerator, denominator].every(Number.isSafeInteger) ||
      whole < 0 || numerator <= 0 || denominator <= numerator) return "invalid_input";
  const equivalent = (whole * denominator + numerator) * divisorNumerator ===
    task.wholeNumber * task.divisor.denominator * denominator;
  if (!equivalent) return "incorrect_answer";
  if (values.simplified === true) {
    const reducedNumerator = parseInteger(values.simplifiedNumerator);
    const reducedDenominator = parseInteger(values.simplifiedDenominator);
    const valid = Number.isSafeInteger(reducedNumerator) && Number.isSafeInteger(reducedDenominator) &&
      reducedNumerator > 0 && reducedDenominator > reducedNumerator &&
      gcd(reducedNumerator, reducedDenominator) === 1 &&
      reducedNumerator * denominator === numerator * reducedDenominator &&
      whole === task.answer.whole &&
      reducedNumerator * task.answer.denominator === task.answer.numerator * reducedDenominator;
    return valid ? "valid" : "not_simplified";
  }
  return gcd(numerator, denominator) === 1 ? "valid" : "requires_simplification";
}
function normalizeTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length !== 15) throw new TypeError("Exactly 15 division tasks are required.");
  const ids = new Set();
  return Object.freeze(tasks.map((task, index) => {
    const { wholeNumber, divisor, answer } = task || {};
    if (typeof task?.id !== "string" || !task.id || ids.has(task.id) ||
        !Number.isSafeInteger(wholeNumber) || wholeNumber <= 0 ||
        !divisor || !Number.isSafeInteger(divisor.whole) || divisor.whole < 1 ||
        !Number.isSafeInteger(divisor.numerator) || divisor.numerator <= 0 ||
        !Number.isSafeInteger(divisor.denominator) || divisor.denominator <= divisor.numerator ||
        !answer || !Number.isSafeInteger(answer.whole) || answer.whole < 0 ||
        !Number.isSafeInteger(answer.numerator) || answer.numerator <= 0 ||
        !Number.isSafeInteger(answer.denominator) || answer.denominator <= answer.numerator ||
        gcd(answer.numerator, answer.denominator) !== 1) {
      throw new TypeError("Task " + index + " is not a valid simplified mixed-number division task.");
    }
    const divisorNumerator = divisor.whole * divisor.denominator + divisor.numerator;
    const answerNumerator = answer.whole * answer.denominator + answer.numerator;
    if (wholeNumber * divisor.denominator * answer.denominator !== answerNumerator * divisorNumerator) {
      throw new TypeError("Task " + index + " has an incorrect answer.");
    }
    ids.add(task.id);
    return Object.freeze({ id: task.id, wholeNumber, divisor: Object.freeze({ ...divisor }), answer: Object.freeze({ ...answer }) });
  }));
}

function createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession({ learnerKey, storage = globalThis.localStorage, tasks } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  const configuredTasks = normalizeTasks(tasks);
  const key = STORAGE_PREFIX + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 1, completedTaskIds: [], completedStepIdsByTask: {}, responsesByTask: {} });

  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let saved;
    try { saved = JSON.parse(raw); } catch { throw new Error("Saved guided division practice is unreadable."); }
    if (!saved || saved.schemaVersion !== 1 || !Array.isArray(saved.completedTaskIds) ||
        !saved.completedStepIdsByTask || typeof saved.completedStepIdsByTask !== "object" ||
        !saved.responsesByTask || typeof saved.responsesByTask !== "object") {
      throw new Error("Saved guided division practice has an unsupported format.");
    }
    const completedStepIdsByTask = {};
    const responsesByTask = {};
    for (const task of configuredTasks) {
      const completed = saved.completedStepIdsByTask[task.id] || [];
      const responses = saved.responsesByTask[task.id] || [];
      if (!Array.isArray(completed) || completed.some((id, i) => STEP_IDS[i] !== id) || completed.length > STEP_IDS.length ||
          !Array.isArray(responses) || responses.some(response =>
            !response || !STEP_IDS.includes(response.stepId) || !CLASSIFICATIONS.includes(response.classification) ||
            typeof response.rawValue !== "string" ||
            (response.values != null && (typeof response.values !== "object" || Array.isArray(response.values))))) {
        throw new Error("Saved guided division practice contains an invalid step sequence.");
      }
      completedStepIdsByTask[task.id] = [...completed];
      responsesByTask[task.id] = responses.map(response => ({
        stepId: response.stepId, rawValue: response.rawValue, classification: response.classification,
        ...(response.values ? { values: { ...response.values } } : {})
      }));
    }
    return {
      schemaVersion: 1,
      completedTaskIds: saved.completedTaskIds.filter(id => configuredTasks.some(task => task.id === id)),
      completedStepIdsByTask, responsesByTask
    };
  }
  function activeTask(state) { return configuredTasks.find(task => !state.completedTaskIds.includes(task.id)) || null; }
  function validValue(state, taskId, stepId) {
    const found = [...(state.responsesByTask[taskId] || [])].reverse().find(r => r.stepId === stepId && r.classification === "valid");
    return found ? Number(found.rawValue) : null;
  }
  function getCurrentStep() {
    const state = read();
    const task = activeTask(state);
    if (!task) return null;
    const completed = state.completedStepIdsByTask[task.id] || [];
    const stepId = STEP_IDS[completed.length];
    const divisorNumerator = task.divisor.whole * task.divisor.denominator + task.divisor.numerator;
    const scaledDividend = task.wholeNumber * task.divisor.denominator;
    const step = {
      taskId: task.id, taskNumber: configuredTasks.indexOf(task) + 1, totalTasks: configuredTasks.length,
      task, divisorNumerator, scaledDividend, completedStepIds: Object.freeze([...completed]),
      stepId, stepNumber: completed.length + 1, totalSteps: STEP_IDS.length
    };
    if (stepId === "make_divisor_whole") {
      step.prompt = "Zet het gemengde getal om in een breuk. Vergroot die breuk daarna tot een heel getal.";
      step.expression = "Gemengd getal omzetten naar een heel getal";
    } else if (stepId === "scale_dividend") {
      step.prompt = "Je hebt de deler met de noemer vermenigvuldigd. Vermenigvuldig het hele getal met dezelfde noemer.";
      step.expression = task.wholeNumber + " × " + task.divisor.denominator + " = ?";
    } else if (stepId === "calculate_quotient") {
      step.prompt = "Deel de twee hele getallen. Geef het antwoord als een vereenvoudigd gemengd getal.";
      step.expression = scaledDividend + " : " + divisorNumerator;
    }
    return Object.freeze(step);
  }
  function getProgress() {
    const state = read();
    const completedTaskCount = state.completedTaskIds.length;
    return Object.freeze({
      completedCount: completedTaskCount, totalCount: configuredTasks.length,
      completedStepCount: configuredTasks.reduce((sum, task) => sum + state.completedStepIdsByTask[task.id].length, 0),
      totalStepCount: configuredTasks.length * STEP_IDS.length,
      attemptCount: configuredTasks.reduce((sum, task) => sum + state.responsesByTask[task.id].length, 0),
      isComplete: completedTaskCount === configuredTasks.length
    });
  }
  function recordResponse({ rawValue, values } = {}) {
    const current = getCurrentStep();
    if (!current) throw new Error("The guided division practice session is complete.");
    const task = current.task;
    const raw = String(rawValue ?? "");
    const value = parseInteger(raw);
    let classification = "invalid_input";
    if (current.stepId === "make_divisor_whole") {
      if (Number.isSafeInteger(value) && value > 0) classification = value === current.divisorNumerator ? "valid" : "incorrect_answer";
    } else if (current.stepId === "scale_dividend") {
      if (Number.isSafeInteger(value) && value > 0) classification = value === current.scaledDividend ? "valid" : "incorrect_answer";
    } else {
      classification = classifyFinalAnswer(values, task, current.divisorNumerator);
    }
    const state = read();
    const responses = state.responsesByTask[task.id] || [];
    responses.push({
      stepId: current.stepId, rawValue, classification,
      ...(current.stepId === "calculate_quotient" ? { values: values && typeof values === "object" ? { ...values } : {} } : {})
    });
    state.responsesByTask[task.id] = responses;
    if (classification === "valid") {
      const completed = state.completedStepIdsByTask[task.id] || [];
      completed.push(current.stepId);
      state.completedStepIdsByTask[task.id] = completed;
      if (completed.length === STEP_IDS.length) state.completedTaskIds.push(task.id);
    }
    storage.setItem(key, JSON.stringify(state));
    return Object.freeze({ classification, progress: getProgress(), currentStep: getCurrentStep() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentStep, getProgress, recordResponse, reset });
}

export { createFractionWholeNumberDividedByFractionGreaterThanOneGuidedSession };
