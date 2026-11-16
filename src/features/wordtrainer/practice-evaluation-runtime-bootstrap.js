import { createPracticeEvaluationRuntime } from './practice-evaluation-runtime.js';

export function bootstrapPracticeEvaluationRuntime({ runtime, target = globalThis } = {}) {
  if (!runtime || typeof runtime.gradeWithAI !== 'function') {
    throw new Error('bootstrapPracticeEvaluationRuntime requires runtime.gradeWithAI');
  }

  const evaluator = createPracticeEvaluationRuntime({ gradeWithAI: runtime.gradeWithAI });
  target.pacoGOPracticeEvaluationRuntime = evaluator;
  return evaluator;
}
