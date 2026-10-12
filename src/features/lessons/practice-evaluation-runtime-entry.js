import {
  evaluateFixedAnswerRules,
  evaluatePracticeDeterministicAnswer,
  getPracticeAnswerParts
} from './practice-evaluation.js';

function requireHost(host) {
  if (!host || typeof host !== 'object') throw new Error('A practice evaluation runtime host is required.');
  if (typeof host.gradeAnswer !== 'function') throw new Error('The practice evaluation runtime host is missing: gradeAnswer.');
}

function result(correct, fixedRules, feedback = '', acceptedAnswers = null) {
  return Object.freeze({
    correct: correct === true,
    feedback: String(feedback ?? ''),
    fixedRules,
    acceptedAnswers: acceptedAnswers ? Object.freeze([...acceptedAnswers]) : null
  });
}

export function createPracticeEvaluationRuntimeEntry(host = {}) {
  requireHost(host);

  async function evaluate(item, userAnswer, { type = 'words', aiCheckAnswers = true } = {}) {
    const practiceType = String(type || 'words');

    if (practiceType === 'dictation' || practiceType === 'math' || practiceType === 'spelling') {
      const acceptedAnswers = practiceType === 'dictation' ? getPracticeAnswerParts(item) : null;
      return result(evaluatePracticeDeterministicAnswer(practiceType, item, userAnswer), null, '', acceptedAnswers);
    }

    const fixedRules = evaluateFixedAnswerRules(item, userAnswer);
    if (fixedRules.hasRules && !fixedRules.ok) return result(false, fixedRules);

    if (practiceType === 'custom' && !aiCheckAnswers) {
      return result(evaluatePracticeDeterministicAnswer('custom', item, userAnswer), fixedRules);
    }

    const grading = await host.gradeAnswer(
      String(item?.question ?? ''),
      String(item?.answer ?? ''),
      String(userAnswer ?? '')
    );
    return result(grading?.correct === true, fixedRules, grading?.feedback || '');
  }

  async function gradeAnswer(...args) {
    return host.gradeAnswer(...args);
  }

  return Object.freeze({ evaluate, gradeAnswer, getPracticeAnswerParts });
}

export const createPracticeEvaluationRuntime = createPracticeEvaluationRuntimeEntry;
export { countAnswerWords, evaluateFixedAnswerRules } from './practice-evaluation.js';

export function installPracticeEvaluationRuntimeEntry(host, target = globalThis) {
  if (!target || typeof target !== 'object') throw new Error('A practice evaluation runtime target is required.');
  const entry = createPracticeEvaluationRuntimeEntry(host);
  target.pacoGOPracticeEvaluationRuntime = entry;
  target.pacoGOPracticeEvaluationReady = Promise.resolve(entry);
  target.pacoGOPracticeEvaluation = (item, userAnswer, options) => entry.evaluate(item, userAnswer, options);
  return entry;
}
