import { evaluatePracticeAnswer } from './practice-evaluation-service.js';

export function createPracticeEvaluationRuntime({ gradeWithAI } = {}) {
  if (typeof gradeWithAI !== 'function') {
    throw new Error('createPracticeEvaluationRuntime requires gradeWithAI');
  }

  return {
    evaluate(input = {}) {
      return evaluatePracticeAnswer({ ...input, gradeWithAI });
    }
  };
}
