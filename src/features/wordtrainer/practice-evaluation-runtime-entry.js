import { bootstrapPracticeEvaluationRuntime } from './practice-evaluation-runtime-bootstrap.js';

export function installPracticeEvaluationRuntime({ runtime, target = globalThis } = {}) {
  const evaluator = bootstrapPracticeEvaluationRuntime({ runtime, target });
  target.pacoGOPracticeEvaluation = input => evaluator.evaluate(input);
  return evaluator;
}
