import { createMathSession } from './math-domain.js';

export function createMathRuntime({ skill, durationSeconds, now = () => Date.now(), random = Math.random } = {}) {
  if (!skill) throw new TypeError('Math runtime requires a skill.');
  const session = createMathSession({ operation: skill.operation, durationSeconds, random });
  const startedAt = now();
  let finished = false;

  function snapshot() {
    const elapsed = Math.max(0, now() - startedAt);
    const remainingSeconds = Math.max(0, session.durationSeconds - Math.floor(elapsed / 1000));
    if (remainingSeconds === 0) finished = true;
    return Object.freeze({
      skill,
      durationSeconds: session.durationSeconds,
      remainingSeconds,
      score: session.score,
      answered: session.answered,
      correct: session.correct,
      question: finished ? null : session.question,
      finished
    });
  }

  function answer(value) {
    if (finished || snapshot().remainingSeconds === 0) return Object.freeze({ answered: false, correct: false });
    const result = session.answer(value);
    if (result.answered) session.nextQuestion();
    return result;
  }

  function finish() { finished = true; return snapshot(); }

  return Object.freeze({ snapshot, answer, finish });
}
