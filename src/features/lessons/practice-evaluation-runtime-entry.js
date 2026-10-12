import { createAnswerGradingService } from '../../services/answer-grading-service.js';
import {
  evaluateFixedAnswerRules,
  evaluatePracticeDeterministicAnswer,
  getPracticeAnswerParts
} from './practice-evaluation.js';

function resolveGradeAnswer({ db = null, gradeAnswer = null } = {}) {
  if (typeof gradeAnswer === 'function') return gradeAnswer;
  if (db) return createAnswerGradingService(db).gradeAnswer;
  throw new Error('A Supabase client or answer grading dependency is required.');
}

function result(correct, fixedRules, feedback = '', acceptedAnswers = null) {
  return Object.freeze({
    correct: correct === true,
    feedback: String(feedback ?? ''),
    fixedRules,
    acceptedAnswers: acceptedAnswers ? Object.freeze([...acceptedAnswers]) : null
  });
}

export function createPracticeEvaluationRuntimeEntry({ db = null, gradeAnswer = null } = {}) {
  const resolveGrading = resolveGradeAnswer({ db, gradeAnswer });

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

    const grading = await resolveGrading(
      String(item?.question ?? ''),
      String(item?.answer ?? ''),
      String(userAnswer ?? '')
    );
    return result(grading?.correct === true, fixedRules, grading?.feedback || '');
  }

  async function gradeAnswer(...args) {
    return resolveGrading(...args);
  }

  return Object.freeze({ evaluate, gradeAnswer, getPracticeAnswerParts });
}

export const createPracticeEvaluationRuntime = createPracticeEvaluationRuntimeEntry;
export { countAnswerWords, evaluateFixedAnswerRules } from './practice-evaluation.js';

export function installPracticeEvaluationRuntimeEntry(dependencies, target = globalThis) {
  if (!target || typeof target !== 'object') throw new Error('A practice evaluation runtime target is required.');
  const entry = createPracticeEvaluationRuntimeEntry(dependencies);
  target.pacoGOPracticeEvaluationRuntime = entry;
  target.pacoGOPracticeEvaluationReady = Promise.resolve(entry);
  target.pacoGOPracticeEvaluation = (item, userAnswer, options) => entry.evaluate(item, userAnswer, options);
  return entry;
}
