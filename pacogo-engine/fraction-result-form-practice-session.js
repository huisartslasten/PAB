const FRACTION_RESULT_FORM_TASK = Object.freeze({ id: "fraction-result-form-15-10", numerator: 15, denominator: 10 });
const CLASSIFICATIONS = Object.freeze(["valid", "invalid_input", "incorrect_answer", "not_simplified"]);
function createFractionResultFormPracticeSession({ learnerKey, storage = globalThis.localStorage } = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") throw new TypeError("A compatible local storage object is required.");
  const key = "pacogo:fraction-result-form-practice:v2:" + encodeURIComponent(learner);
  const empty = () => ({ schemaVersion: 2, completed: false, responses: [] });
  function read() {
    const raw = storage.getItem(key); if (!raw) return empty();
    let data; try { data = JSON.parse(raw); } catch { throw new Error("Saved fraction result-form practice is unreadable."); }
    if (!data || data.schemaVersion !== 2 || typeof data.completed !== "boolean" || !Array.isArray(data.responses)) throw new Error("Saved fraction result-form practice has an unsupported format.");
    if (data.responses.some(item => !item || !CLASSIFICATIONS.includes(item.classification) || !item.values || typeof item.values !== "object")) throw new Error("Saved fraction result-form practice contains an invalid response.");
    return { schemaVersion: 2, completed: data.completed, responses: data.responses.map(item => ({ classification: item.classification, values: { ...item.values } })) };
  }
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  function getCurrentStage() { return read().completed ? null : Object.freeze({ taskId: FRACTION_RESULT_FORM_TASK.id, stageId: "answer", stageNumber: 1, totalStages: 1, prompt: "Noteer vijftien tienden op jouw manier. Je kunt een heel getal toevoegen en zelf kiezen of je vereenvoudigt.", expression: "vijftien tienden =" }); }
  function getProgress() { const state = read(); return Object.freeze({ completedStageCount: state.completed ? 1 : 0, totalStageCount: 1, attemptCount: state.responses.length, isComplete: state.completed }); }
  function getCompletion() { const state = read(); if (!state.completed) return null; const item = [...state.responses].reverse().find(response => response.classification === "valid"); return item ? Object.freeze({ ...item.values }) : null; }
  function recordResponse({ values } = {}) {
    if (read().completed) throw new Error("The fraction result-form practice is already complete.");
    const value = values && typeof values === "object" ? { wholeNumberEnabled: values.wholeNumberEnabled === true, wholeNumber: String(values.wholeNumber ?? ""), numerator: String(values.numerator ?? ""), denominator: String(values.denominator ?? ""), simplified: values.simplified === true, simplifiedNumerator: String(values.simplifiedNumerator ?? ""), simplifiedDenominator: String(values.simplifiedDenominator ?? "") } : null;
    const fields = value ? [value.numerator, value.denominator, ...(value.wholeNumberEnabled ? [value.wholeNumber] : []), ...(value.simplified ? [value.simplifiedNumerator, value.simplifiedDenominator] : [])] : null;
    const numbers = fields && fields.map(field => /^[0-9]+$/.test(field) ? Number(field) : NaN);
    let classification = "invalid_input";
    if (numbers && numbers.every(number => Number.isSafeInteger(number) && number >= 0)) {
      let index = 0; const numerator = numbers[index++], denominator = numbers[index++], whole = value.wholeNumberEnabled ? numbers[index++] : 0;
      if (denominator > 0 && (!value.wholeNumberEnabled || numerator < denominator)) {
        const sameValue = (whole * denominator + numerator) * 10 === 15 * denominator;
        classification = sameValue ? "valid" : "incorrect_answer";
        if (sameValue && value.simplified) {
          const reducedNumerator = numbers[index++], reducedDenominator = numbers[index++];
          const targetNumerator = value.wholeNumberEnabled ? 5 : 15, targetDenominator = 10;
          const equivalent = reducedDenominator > 0 && reducedNumerator * targetDenominator === targetNumerator * reducedDenominator;
          const reduced = reducedNumerator > 0 && reducedDenominator > 0 && gcd(reducedNumerator, reducedDenominator) === 1;
          classification = equivalent && reduced ? "valid" : "not_simplified";
        }
      } else classification = "incorrect_answer";
    }
    const state = read(); state.responses.push({ classification, values: value || {} }); if (classification === "valid") state.completed = true;
    storage.setItem(key, JSON.stringify(state)); return Object.freeze({ classification, progress: getProgress(), completion: getCompletion() });
  }
  function reset() { storage.removeItem(key); }
  return Object.freeze({ getCurrentStage, getProgress, getCompletion, recordResponse, reset });
}
export { FRACTION_RESULT_FORM_TASK, createFractionResultFormPracticeSession };
