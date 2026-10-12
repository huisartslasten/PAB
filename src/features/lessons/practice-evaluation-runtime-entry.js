import { createAnswerGradingService } from '../../services/answer-grading-service.js';
import {
  evaluateFixedAnswerRules,
  evaluatePracticeDeterministicAnswer,
  getPracticeAnswerParts
} from './practice-evaluation.js';

function resolveGradeAnswer({ db = null, injectedGradeAnswer = null } = {}) {
  if (typeof injectedGradeAnswer === 'function') return injectedGradeAnswer;
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

export function createPracticeEvaluationRuntimeEntry({ db = null, gradeAnswer: injectedGradeAnswer = null } = {}) {
  const resolveGrading = resolveGradeAnswer({ db, injectedGradeAnswer });

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

  return Object.freeze({
    evaluate,
    getPracticeAnswerParts
  });
}

export const createPracticeEvaluationRuntime = createPracticeEvaluationRuntimeEntry;
export { countAnswerWords, evaluateFixedAnswerRules } from './practice-evaluation.js';
